import type { ReactElement } from "react";

export type CalendarSchedulePickerProps = {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: (value: Date) => void;
  trigger: ReactElement;
};
