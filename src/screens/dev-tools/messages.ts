import { msg } from "@lingui/core/macro";

/** Dev Tools screen copy. */
export const devToolsMessages = {
  title: msg({
    id: "devTools.title",
    comment: "Screen title for assessment and developer controls",
    message: "Dev Tools",
  }),
  introduction: msg({
    id: "devTools.introduction",
    message: "Use these controls to reproduce assessment states.",
  }),
  requestModes: msg({
    id: "devTools.requestModes",
    comment: "Section title for simulated request behavior",
    message: "Request modes",
  }),
  catalogDataset: msg({
    id: "devTools.catalogDataset",
    comment: "Section title for selecting the normal or performance activity dataset",
    message: "Catalog dataset",
  }),
  catalogDatasetHelp: msg({
    id: "devTools.catalogDatasetHelp",
    message:
      "Use Supplied for normal review. Performance adds 1,000 local activities and persists for cold starts.",
  }),
  suppliedCatalog: msg({
    id: "devTools.catalogMode.supplied",
    comment: "Catalog mode that uses only the supplied assessment activities",
    message: "Supplied (12)",
  }),
  performanceCatalog: msg({
    id: "devTools.catalogMode.performance",
    comment: "Catalog mode with the supplied activities and 1,000 generated activities",
    message: "Performance (1,012)",
  }),
  catalogModeHint: msg({
    id: "devTools.catalogModeHint",
    message: "Selects this catalog dataset and keeps favorites, filters, and refresh activities.",
  }),
  initialLoad: msg({
    id: "devTools.initialLoad",
    comment: "Setting for the first catalog request",
    message: "First catalog load",
  }),
  initialLoadHelp: msg({
    id: "devTools.initialLoadHelp",
    message: "Controls the first catalog page.",
  }),
  detailLoad: msg({
    id: "devTools.detailLoad",
    comment: "Setting for activity detail request behavior",
    message: "Activity detail",
  }),
  detailLoadHelp: msg({
    id: "devTools.detailLoadHelp",
    message: "Controls activity detail loading and not-found states.",
  }),
  laterPageLoad: msg({
    id: "devTools.laterPageLoad",
    comment: "Setting for later pages during infinite catalog scrolling",
    message: "Later page load",
  }),
  laterPageLoadHelp: msg({
    id: "devTools.laterPageLoadHelp",
    message: "Controls later catalog pages during infinite scrolling.",
  }),
  refresh: msg({
    id: "devTools.refresh",
    comment: "Setting for pull-to-refresh request behavior",
    message: "Refresh",
  }),
  refreshHelp: msg({
    id: "devTools.refreshHelp",
    message: "Controls the next pull-to-refresh request.",
  }),
  normal: msg({
    id: "devTools.mode.normal",
    comment: "Fast successful request mode",
    message: "Normal",
  }),
  slow: msg({
    id: "devTools.mode.slow",
    comment: "Request mode with a deliberate delay",
    message: "Slow",
  }),
  empty: msg({
    id: "devTools.mode.empty",
    comment: "Successful first catalog request with no activities",
    message: "Empty",
  }),
  fail: msg({
    id: "devTools.mode.fail",
    comment: "Request mode that returns an error",
    message: "Offline",
  }),
  timeout: msg({
    id: "devTools.mode.timeout",
    comment: "Request mode that returns a timeout error",
    message: "Timeout",
  }),
  invalidData: msg({
    id: "devTools.mode.invalidData",
    comment: "Request mode that returns an invalid validated payload",
    message: "Invalid data",
  }),
  notFound: msg({
    id: "devTools.mode.notFound",
    comment: "Activity detail mode that returns a missing activity",
    message: "Not found",
  }),
  success: msg({
    id: "devTools.mode.success",
    comment: "Refresh mode that adds one activity",
    message: "Success",
  }),
  modeOptionLabel: msg({
    id: "devTools.modeOptionLabel",
    comment: "Accessible label for one request-mode radio option",
    message: "{setting}: {option}",
  }),
  modeOptionHint: msg({
    id: "devTools.modeOptionHint",
    message: "Selects this request mode.",
  }),
  modeChanged: msg({
    id: "devTools.modeChanged",
    comment: "Screen reader status after a request mode changes",
    message: "{setting} set to {option}. Cached requests cleared.",
  }),
  lifecycleHelp: msg({
    id: "devTools.lifecycleHelp",
    message: "For lifecycle checks, select Slow and background the app during the request.",
  }),
  offlineHelp: msg({
    id: "devTools.offlineHelp",
    message: "Request modes do not simulate the device offline state.",
  }),
  localData: msg({
    id: "devTools.localData",
    comment: "Section title for local assessment data counts",
    message: "Local data",
  }),
  catalogActivities: msg({
    id: "devTools.catalogActivities",
    comment: "Row label for the number of activities in the local catalog",
    message: "Catalog activities",
  }),
  favorites: msg({
    id: "devTools.favorites",
    comment: "Row label for the number of saved favorite activities",
    message: "Favorites",
  }),
  valueAccessibilityLabel: msg({
    id: "devTools.valueAccessibilityLabel",
    comment: "Accessible label for a Dev Tools data row and its current value",
    message: "{label}, {value}",
  }),
  actions: msg({
    id: "devTools.actions",
    comment: "Section title for Dev Tools maintenance actions",
    message: "Actions",
  }),
  clearRequestCache: msg({
    id: "devTools.clearRequestCache",
    comment: "Action that removes cached catalog and activity responses",
    message: "Clear request cache",
  }),
  clearRequestCacheHint: msg({
    id: "devTools.clearRequestCacheHint",
    message: "Applies the selected mode to the next matching request.",
  }),
  requestCacheCleared: msg({
    id: "devTools.requestCacheCleared",
    message: "Request cache cleared.",
  }),
  resetModes: msg({
    id: "devTools.resetModes",
    comment: "Action that restores all request modes to their defaults",
    message: "Reset request modes",
  }),
  resetModesHint: msg({
    id: "devTools.resetModesHint",
    message: "Restores normal catalog and detail loads, and successful refresh.",
  }),
  requestModesReset: msg({
    id: "devTools.requestModesReset",
    message: "Request modes reset.",
  }),
  resetLocalData: msg({
    id: "devTools.resetLocalData",
    comment: "Destructive action that clears all local assessment data",
    message: "Reset local data",
  }),
  resetLocalDataHint: msg({
    id: "devTools.resetLocalDataHint",
    message: "Clears generated activities, favorites, filters, and request cache.",
  }),
  confirmResetTitle: msg({
    id: "devTools.confirmResetTitle",
    comment: "Confirmation title before local assessment data is deleted",
    message: "Reset local data?",
  }),
  confirmResetBody: msg({
    id: "devTools.confirmResetBody",
    message: "This removes generated activities, favorites, filters, and cached requests.",
  }),
  cancel: msg({
    id: "devTools.cancel",
    comment: "Button that cancels local data reset",
    message: "Cancel",
  }),
  reset: msg({
    id: "devTools.reset",
    comment: "Destructive confirmation button that resets local data",
    message: "Reset",
  }),
  localDataReset: msg({
    id: "devTools.localDataReset",
    message: "Local data reset.",
  }),
  feedbackPolicy: msg({
    id: "devTools.feedbackPolicy",
    comment: "Dev Tools section for previewing permitted feedback surfaces",
    message: "Feedback policy",
  }),
  feedbackPolicyHelp: msg({
    id: "devTools.feedbackPolicyHelp",
    message: "Success and cancel stay silent. Only confirmed calendar saves show success feedback.",
  }),
  nativeFeedbackModule: msg({
    id: "devTools.nativeFeedbackModule",
    comment: "Row label for the native toast module status",
    message: "Native feedback module",
  }),
  nativeFeedbackAvailable: msg({
    id: "devTools.nativeFeedbackAvailable",
    comment: "Native toast module status when installed",
    message: "Ready",
  }),
  nativeFeedbackUnavailable: msg({
    id: "devTools.nativeFeedbackUnavailable",
    comment: "Native toast module status when missing",
    message: "Unavailable",
  }),
  nativeFeedbackStatusLabel: msg({
    id: "devTools.nativeFeedbackStatusLabel",
    comment: "Accessible label for the native feedback module and its status",
    message: "Native feedback module, {status}",
  }),
  transientErrorAction: msg({
    id: "devTools.transientErrorAction",
    comment: "Action that previews a transient error toast",
    message: "Preview transient error",
  }),
  transientErrorHint: msg({
    id: "devTools.transientErrorHint",
    message: "Shows the toast used when content stays usable after a temporary failure.",
  }),
  transientErrorTitle: msg({
    id: "devTools.transientErrorTitle",
    message: "Could not refresh",
  }),
  transientErrorBody: msg({
    id: "devTools.transientErrorBody",
    message: "Your current activities are still available.",
  }),
  actionableErrorAction: msg({
    id: "devTools.actionableErrorAction",
    comment: "Action that previews an inline retry surface",
    message: "Preview actionable error",
  }),
  actionableErrorHint: msg({
    id: "devTools.actionableErrorHint",
    message: "Shows the inline recovery design used when a clear action can help.",
  }),
  inlinePreviewTitle: msg({
    id: "devTools.inlinePreviewTitle",
    message: "Could not load more activities",
  }),
  inlinePreviewBody: msg({
    id: "devTools.inlinePreviewBody",
    message: "Your current activities stay available. Try the request again.",
  }),
  inlinePreviewAction: msg({
    id: "devTools.inlinePreviewAction",
    comment: "Retry action in the inline recovery preview",
    message: "Try again",
  }),
  calendarSuccessAction: msg({
    id: "devTools.calendarSuccessAction",
    comment: "Action that previews confirmed calendar save feedback",
    message: "Preview calendar success",
  }),
  calendarSuccessHint: msg({
    id: "devTools.calendarSuccessHint",
    message: "Shows the only success toast allowed by the feedback policy.",
  }),
  calendarSuccessTitle: msg({
    id: "devTools.calendarSuccessTitle",
    message: "Added to Calendar",
  }),
  calendarSuccessBody: msg({
    id: "devTools.calendarSuccessBody",
    message: "The event was saved to your calendar.",
  }),
} as const;
