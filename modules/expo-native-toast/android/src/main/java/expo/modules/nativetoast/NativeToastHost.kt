package expo.modules.nativetoast

import android.app.Activity
import android.app.Application
import android.content.Context
import android.graphics.Typeface
import android.os.Build
import android.os.Bundle
import android.text.SpannableStringBuilder
import android.text.Spanned
import android.text.style.StyleSpan
import android.view.HapticFeedbackConstants
import android.view.View
import android.view.ViewGroup
import android.view.ViewTreeObserver
import android.widget.TextView
import androidx.annotation.ColorRes
import androidx.annotation.DrawableRes
import androidx.core.content.ContextCompat
import androidx.core.graphics.drawable.DrawableCompat
import com.google.android.material.navigation.NavigationBarView
import com.google.android.material.snackbar.Snackbar
import java.lang.ref.WeakReference

internal object NativeToastHost : Application.ActivityLifecycleCallbacks {
  const val DEFAULT_DURATION_MILLISECONDS = 6_000
  private const val ICON_SIZE_DP = 20
  private const val ICON_SPACING_DP = 12

  private var currentActivity = WeakReference<Activity>(null)
  private var currentSnackbar: WeakReference<Snackbar>? = null
  private var pendingToast: PendingToast? = null

  fun install(context: Context) {
    (context.applicationContext as? Application)?.registerActivityLifecycleCallbacks(this)
  }

  @Synchronized
  fun show(options: NativeToastOptions, onAction: () -> Unit) {
    val activity = currentActivity.get()
    if (activity == null || !activity.hasWindowFocus()) {
      pendingToast = PendingToast(options, onAction)
      activity?.let(::showPendingWhenWindowFocused)
      return
    }

    present(activity, options, onAction)
  }

  private fun present(activity: Activity, options: NativeToastOptions, onAction: () -> Unit) {
    activity.runOnUiThread {
      if (!activity.hasWindowFocus()) {
        synchronized(this) {
          pendingToast = PendingToast(options, onAction)
        }
        showPendingWhenWindowFocused(activity)
        return@runOnUiThread
      }

      val anchor = activity.findViewById<View>(android.R.id.content) ?: return@runOnUiThread
      currentSnackbar?.get()?.dismiss()
      val kind = NativeToastKind.from(options.type)
      playHaptic(anchor, kind)

      val snackbar = Snackbar.make(anchor, buildBody(options), options.duration.coerceAtLeast(1_000))
      findBottomNavigationAnchor(activity.window.decorView)?.let(snackbar::setAnchorView)
      styleMessage(snackbar, kind)
      options.actionLabel?.takeIf(String::isNotBlank)?.let { label ->
        snackbar.setAction(label) { onAction() }
      }
      snackbar.show()
      currentSnackbar = WeakReference(snackbar)
    }
  }

  private fun showPendingWhenWindowFocused(activity: Activity) {
    activity.runOnUiThread {
      if (activity.hasWindowFocus()) {
        showPending(activity)
        return@runOnUiThread
      }

      val decorView = activity.window.decorView
      val observer = decorView.viewTreeObserver
      lateinit var listener: ViewTreeObserver.OnWindowFocusChangeListener
      listener = ViewTreeObserver.OnWindowFocusChangeListener { hasFocus ->
        if (!hasFocus) return@OnWindowFocusChangeListener
        if (observer.isAlive) observer.removeOnWindowFocusChangeListener(listener)
        showPending(activity)
      }
      observer.addOnWindowFocusChangeListener(listener)
    }
  }

  private fun showPending(activity: Activity) {
    val pending = synchronized(this) {
      pendingToast.also { pendingToast = null }
    }
    pending?.let { present(activity, it.options, it.onAction) }
  }

  @Synchronized
  fun dismiss() {
    pendingToast = null
    currentActivity.get()?.runOnUiThread {
      currentSnackbar?.get()?.dismiss()
      currentSnackbar = null
    }
  }

  private fun buildBody(options: NativeToastOptions): CharSequence =
    SpannableStringBuilder(options.title).apply {
      setSpan(StyleSpan(Typeface.BOLD), 0, length, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE)
      options.message?.takeIf(String::isNotBlank)?.let { message ->
        append('\n')
        append(message)
      }
    }

  private fun styleMessage(snackbar: Snackbar, kind: NativeToastKind) {
    val messageView = snackbar.view.findViewById<TextView>(
      com.google.android.material.R.id.snackbar_text,
    ) ?: return
    val icon = ContextCompat.getDrawable(messageView.context, kind.iconResource)?.mutate() ?: return
    DrawableCompat.setTint(icon, ContextCompat.getColor(messageView.context, kind.tintResource))

    val density = messageView.resources.displayMetrics.density
    val iconSize = (ICON_SIZE_DP * density).toInt()
    icon.setBounds(0, 0, iconSize, iconSize)
    messageView.compoundDrawablePadding = (ICON_SPACING_DP * density).toInt()
    messageView.setCompoundDrawablesRelative(icon, null, null, null)
  }

  private fun findBottomNavigationAnchor(root: View): View? {
    val itemContent = root.findViewById<View>(
      com.google.android.material.R.id.navigation_bar_item_content_container,
    )
    val item = itemContent?.parent as? View
    val navigationBar = item?.parent as? View
    if (navigationBar?.isShown == true) return navigationBar

    return findVisibleNavigationBar(root)
  }

  private fun findVisibleNavigationBar(view: View): NavigationBarView? {
    if (view is NavigationBarView && view.isShown) return view
    if (view !is ViewGroup) return null

    for (index in 0 until view.childCount) {
      findVisibleNavigationBar(view.getChildAt(index))?.let { return it }
    }
    return null
  }

  private fun playHaptic(view: View, kind: NativeToastKind) {
    val feedback = when (kind) {
      NativeToastKind.SUCCESS -> if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
        HapticFeedbackConstants.CONFIRM
      } else {
        HapticFeedbackConstants.VIRTUAL_KEY
      }
      NativeToastKind.ERROR -> if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
        HapticFeedbackConstants.REJECT
      } else {
        HapticFeedbackConstants.LONG_PRESS
      }
      NativeToastKind.WARNING -> HapticFeedbackConstants.LONG_PRESS
      NativeToastKind.INFO -> HapticFeedbackConstants.CLOCK_TICK
    }
    view.performHapticFeedback(feedback)
  }

  override fun onActivityResumed(activity: Activity) {
    val hasPending = synchronized(this) {
      currentActivity = WeakReference(activity)
      pendingToast != null
    }
    if (hasPending) showPendingWhenWindowFocused(activity)
  }

  override fun onActivityPaused(activity: Activity) {
    synchronized(this) {
      if (currentActivity.get() === activity) currentActivity.clear()
    }
  }

  override fun onActivityDestroyed(activity: Activity) {
    synchronized(this) {
      if (currentActivity.get() === activity) currentActivity.clear()
    }
  }

  override fun onActivityCreated(activity: Activity, state: Bundle?) = Unit
  override fun onActivityStarted(activity: Activity) = Unit
  override fun onActivityStopped(activity: Activity) = Unit
  override fun onActivitySaveInstanceState(activity: Activity, state: Bundle) = Unit
}

private data class PendingToast(
  val options: NativeToastOptions,
  val onAction: () -> Unit,
)

private enum class NativeToastKind(
  @param:DrawableRes val iconResource: Int,
  @param:ColorRes val tintResource: Int,
) {
  ERROR(R.drawable.ic_native_toast_error, R.color.native_toast_error_icon),
  INFO(R.drawable.ic_native_toast_info, R.color.native_toast_info_icon),
  SUCCESS(R.drawable.ic_native_toast_success, R.color.native_toast_success_icon),
  WARNING(R.drawable.ic_native_toast_warning, R.color.native_toast_warning_icon),
  ;

  companion object {
    fun from(value: String): NativeToastKind = entries.find {
      it.name.equals(value, ignoreCase = true)
    } ?: INFO
  }
}
