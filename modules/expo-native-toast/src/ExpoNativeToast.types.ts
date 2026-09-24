export type NativeToastType = "error" | "warning" | "info" | "success";

export type NativeToastOptions = {
  actionLabel?: string;
  duration?: number;
  id?: string;
  message?: string;
  title: string;
  type: NativeToastType;
};

export type NativeToastActionEvent = {
  id: string;
};
