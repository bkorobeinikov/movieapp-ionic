import { AsyncStatus } from "./async-status";

export interface AsyncOperation {
    status: AsyncStatus;

    pending: boolean;
    success: boolean;
    fail: boolean;

    /**
     * last message of an async operation
     */
    message: string;

    completedAt: Date;
}

export const defaultAsyncOp = (): AsyncOperation => makeAsyncOp(AsyncStatus.None);
export const makeAsyncOp = (status: AsyncStatus, message?: string, completedAt?: Date) => {
    return {
        status: status,

        pending: status == AsyncStatus.Pending,
        success: status == AsyncStatus.Success,
        fail: status == AsyncStatus.Fail,

        message: message,
        completedAt: (status == AsyncStatus.Success || status == AsyncStatus.Fail) ? (completedAt || new Date()) : null,
    };
}