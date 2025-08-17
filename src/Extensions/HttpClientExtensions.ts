import axios, { AxiosInstance, AxiosResponse } from "axios";

export interface ApiError {
  code: number;
  description: string;
}

export interface ApiErrorResponse {
  error: ApiError;
}

export class HttpClientExtensions {
  private client: AxiosInstance;

  constructor(IrisUrl?: string, token?: string) {
    this.client = axios.create({
      baseURL: IrisUrl,
      headers: token ? { Authorization: `Bearer ${token}` } : undefined
    });
  }

  async getWithRetry<T>(url: string, params?: Record<string, unknown>, maxRetries: number = 3): Promise<T> {
    const queryString = params
      ? "?" + Object.entries(params).map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(this.formatValue(v))}`).join("&")
      : "";
    const fullUrl = `${url}${queryString}`;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response: AxiosResponse = await this.client.get(fullUrl);
        const data = response.data;

        if (data?.error) {
          const apiError = data as ApiErrorResponse;
          const error = new Error(apiError.error.description);
          (error as any).code = apiError.error.code;
          throw error;
        }

        if (response.status < 200 || response.status >= 300) {
          throw new Error(`HTTP ошибка ${response.status}: ${JSON.stringify(data)}`);
        }

        return data as T;
      } catch (err: any) {
        if (attempt < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
        } else {
          throw new Error(`Выполнены все попытки, запрос не выполнен. Ошибка: ${err.message || err}`);
        }
      }
    }

    throw new Error("Неизвестная ошибка getWithRetry");
  }

  private formatValue(value: unknown): string {
    if (typeof value === "number") return value.toString();
    if (typeof value === "boolean") return value ? "1" : "0";
    if (typeof value === "string") return value;
    return String(value ?? "");
  }
}