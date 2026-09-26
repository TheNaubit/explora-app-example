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
import android.widget.TextView
import androidx.annotation.ColorRes
import androidx.annotation.DrawableRes
import androidx.core.content.ContextCompat
import androidx.core.graphics.drawable.DrawableCompat
import com.google.android.material.snackbar.Snackbar
import java.lang.ref.WeakReference

internal object NativeToastHost : Application.ActivityLifecycleCallbacks {
  const val DEFAULT_DURATION_MILLISECONDS = 3_000
  private const val ICON_SIZE_DP = 20
  private const val ICON_SPACING_DP = 12

  private var currentActivity = WeakReference<Activity>(null)
  private var currentSnackbar: WeakReference<Snackbar>? = null

  fun install(context: Context) {
    (context.applicationContext as? Application)?.registerActivityLifecycleCallbacks(this)
  }

  fun show(options: NativeToastOptions, onAction: () -> Unit) {
    val activity = currentActivity.get() ?: return
    activity.runOnUiThread {
      val anchor = activity.findViewById<View>(android.R.id.content) ?: return@runOnUiThread
      currentSnackbar?.get()?.dismiss()
      val kind = NativeToastKind.from(options.type)
      playHaptic(anchor, kind)

      val snackbar = Snackbar.make(anchor, buildBody(options), options.duration.coerceAtLeast(1_000))
      styleMessage(snackbar, kind)
      options.actionLabel?.takeIf(String::isNotBlank)?.let { label ->
        snackbar.setAction(label) { onAction() }
      }
      snackbar.show()
      currentSnackbar = WeakReference(snackbar)
    }
  }

  fun dismiss() {
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
    currentActivity = WeakReference(activity)
  }

  override fun onActivityPaused(activity: Activity) {
    if (currentActivity.get() === activity) currentActivity.clear()
  }

  override fun onActivityDestroyed(activity: Activity) {
    if (currentActivity.get() === activity) currentActivity.clear()
  }

  override fun onActivityCreated(activity: Activity, state: Bundle?) = Unit
  override fun onActivityStarted(activity: Activity) = Unit
  override fun onActivityStopped(activity: Activity) = Unit
  override fun onActivitySaveInstanceState(activity: Activity, state: Bundle) = Unit
}

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
