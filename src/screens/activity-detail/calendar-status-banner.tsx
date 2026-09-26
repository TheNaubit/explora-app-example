import { InlineStatusBanner } from "@/components/inline-status-banner";

type CalendarStatusBannerProps = {
  actionLabel?: string;
  body: string;
  onAction?: () => void;
  title: string;
};

/** Calendar result message with an optional recovery action. */
export function CalendarStatusBanner({
  actionLabel,
  body,
  onAction,
  title,
}: CalendarStatusBannerProps) {
  return (
    <InlineStatusBanner
      actionLabel={actionLabel}
      actionTestID="calendar-status-action"
      body={body}
      inset={false}
      onAction={onAction}
      testID="calendar-status-banner"
      title={title}
    />
  );
}
