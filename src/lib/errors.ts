import { toast } from "sonner";

export class AppError extends Error {
  constructor(
    message: string,
    public code: string = "UNKNOWN_ERROR",
    public statusCode: number = 500
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class ApiError extends AppError {
  constructor(
    message: string,
    public statusCode: number = 500,
    public details?: unknown
  ) {
    super(message, "API_ERROR", statusCode);
    this.name = "ApiError";
  }
}

export class NetworkError extends AppError {
  constructor(message = "网络连接失败，请检查网络后重试") {
    super(message, "NETWORK_ERROR", 0);
    this.name = "NetworkError";
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof AppError) return error.message;
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "发生未知错误，请稍后重试";
}

export function showErrorToast(error: unknown, fallback?: string) {
  const message = fallback ?? getErrorMessage(error);
  toast.error(message, {
    duration: 5000,
    description:
      error instanceof ApiError && error.statusCode >= 500
        ? "服务暂时不可用，请稍后再试"
        : undefined,
  });
}

export function showSuccessToast(message: string, description?: string) {
  toast.success(message, { description, duration: 3000 });
}

export function showLoadingToast(message: string) {
  return toast.loading(message);
}

export function dismissToast(id: string | number) {
  toast.dismiss(id);
}

export async function withErrorHandling<T>(
  fn: () => Promise<T>,
  errorMessage?: string
): Promise<T | null> {
  try {
    return await fn();
  } catch (error) {
    showErrorToast(error, errorMessage);
    return null;
  }
}
