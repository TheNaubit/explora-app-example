/** The UI treatment that follows an action outcome. */
export type FeedbackPresentation = "inline" | "none" | "toast";

/** The result type that determines feedback. */
export type FeedbackOutcome =
  | { kind: "success"; source: "calendar" | "default" }
  | { kind: "canceled" }
  | { kind: "no-change" }
  | { kind: "error"; recovery: "actionable" | "transient" };

/**
 * Map an action outcome to one feedback treatment.
 * Calendar success is the only success that gets a toast.
 */
export function resolveFeedbackPresentation(outcome: FeedbackOutcome): FeedbackPresentation {
  switch (outcome.kind) {
    case "success":
      return outcome.source === "calendar" ? "toast" : "none";
    case "canceled":
    case "no-change":
      return "none";
    case "error":
      return outcome.recovery === "actionable" ? "inline" : "toast";
  }
}
