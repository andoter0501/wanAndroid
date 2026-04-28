export enum LoadStatus {
    Idle = "Idle",
    Loading = "Loading",
    Success = "Success",
    Empty = "Empty",
    Error = "Error"
}
export class UiState<T> {
    status: LoadStatus = LoadStatus.Idle;
    data?: T;
    message: string = '';
    static loading<T>(): UiState<T> {
        const state = new UiState<T>();
        state.status = LoadStatus.Loading;
        return state;
    }
    static success<T>(data: T): UiState<T> {
        const state = new UiState<T>();
        state.status = LoadStatus.Success;
        state.data = data;
        return state;
    }
    static empty<T>(message: string = '暂无数据'): UiState<T> {
        const state = new UiState<T>();
        state.status = LoadStatus.Empty;
        state.message = message;
        return state;
    }
    static error<T>(message: string): UiState<T> {
        const state = new UiState<T>();
        state.status = LoadStatus.Error;
        state.message = message;
        return state;
    }
}
