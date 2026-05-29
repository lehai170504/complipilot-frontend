import { toast as sonnerToast } from "sonner";

type ToastOptions = {
  description?: string;
  duration?: number;
};

export const toast = {
  success(message: string, options?: ToastOptions) {
    return sonnerToast.success(message, {
      duration: options?.duration ?? 3000,
      description: options?.description,
    });
  },

  error(message: string, options?: ToastOptions) {
    return sonnerToast.error(message, {
      duration: options?.duration ?? 5000,
      description: options?.description,
    });
  },

  info(message: string, options?: ToastOptions) {
    return sonnerToast.info(message, {
      duration: options?.duration ?? 3000,
      description: options?.description,
    });
  },

  promise<T>(
    promise: Promise<T> | (() => Promise<T>),
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: unknown) => string);
    }
  ) {
    return sonnerToast.promise(promise, {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
    });
  },
};