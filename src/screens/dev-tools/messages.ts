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
  initialLoad: msg({
    id: "devTools.initialLoad",
    comment: "Setting for the first catalog or activity request",
    message: "Initial load",
  }),
  initialLoadHelp: msg({
    id: "devTools.initialLoadHelp",
    message: "Controls the first catalog page and activity detail requests.",
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
  fail: msg({
    id: "devTools.mode.fail",
    comment: "Request mode that returns an error",
    message: "Fail",
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
    message: "{setting} set to {option}.",
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
    message: "Restores normal loads and successful refresh.",
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
} as const;
