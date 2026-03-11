export interface ApiError
{
    code: number; // Код ошибки
    description: string; // Текстовое описание ошибки
}

export interface ApiErrorResponse
{
    error: ApiError; // Обертка ошибки в формате Iris API
}