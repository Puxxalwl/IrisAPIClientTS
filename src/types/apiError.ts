export interface ApiError
{
    code: number; // код ошибки
    description: string; // описание
}

export interface ApiErrorResponse
{
    error: ApiError;
}