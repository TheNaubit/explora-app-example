package expo.modules.nativetoast

import android.app.Activity
import android.app.Application
import android.content.Context
import android.os.Build
import android.os.Bundle
import android.view.HapticFeedbackConstants
import android.view.View
import com.google.android.material.snackbar.Snackbar
import java.lang.ref.WeakReference

internal object NativeToastHost : Application.ActivityLifecycleCallbacks {
  const val DEFAULT_DURATION_MILLISECONDS = 3_000

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
      playHaptic(anchor, options.type)

      val body = listOfNotNull(options.title, options.message?.takeIf(String::isNotBlank))
        .joinToString(separator = "\n")
      val snackbar = Snackbar.make(anchor, body, options.duration.coerceAtLeast(1_000))
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

  private fun playHaptic(view: View, type: String) {
    val feedback = when (type) {
      "success" -> if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
        HapticFeedbackConstants.CONFIRM
      } else {
        HapticFeedbackConstants.VIRTUAL_KEY
      }
      "error" -> if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
        HapticFeedbackConstants.REJECT
      } else {
        HapticFeedbackConstants.LONG_PRESS
      }
      "warning" -> HapticFeedbackConstants.LONG_PRESS
      else -> HapticFeedbackConstants.CLOCK_TICK
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
