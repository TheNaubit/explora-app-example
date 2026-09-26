import { resolveFeedbackPresentation, type FeedbackOutcome } from "@/feedback/feedback-policy";

describe("feedback policy", () => {
  it("keeps normal successful actions silent", () => {
    const outcome: FeedbackOutcome = { kind: "success", source: "default" };

    expect(resolveFeedbackPresentation(outcome)).toBe("none");
  });

  it("shows a toast only after calendar success", () => {
    const outcome: FeedbackOutcome = { kind: "success", source: "calendar" };

    expect(resolveFeedbackPresentation(outcome)).toBe("toast");
  });

  it("keeps canceled actions silent", () => {
    const outcome: FeedbackOutcome = { kind: "canceled" };

    expect(resolveFeedbackPresentation(outcome)).toBe("none");
  });

  it("keeps outcomes without a state change silent", () => {
    const outcome: FeedbackOutcome = { kind: "no-change" };

    expect(resolveFeedbackPresentation(outcome)).toBe("none");
  });

  it("shows transient errors in a toast", () => {
    const outcome: FeedbackOutcome = { kind: "error", recovery: "transient" };

    expect(resolveFeedbackPresentation(outcome)).toBe("toast");
  });

  it("shows actionable errors inline", () => {
    const outcome: FeedbackOutcome = { kind: "error", recovery: "actionable" };

    expect(resolveFeedbackPresentation(outcome)).toBe("inline");
  });
});
