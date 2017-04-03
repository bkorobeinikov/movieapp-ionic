export interface ServiceResponse<T> {
    code: string;
    message: string;

    data: T;
}