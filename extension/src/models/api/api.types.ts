interface BaseResponse {
   statusCode: number;
   error: string;
}
export interface ResponsePayload<T> extends BaseResponse {
   data: T;
}

export interface PaginatedResponse<T> {
   entities: T[];
   total: number;
}

export interface PaginatedResponsePayload<T> extends BaseResponse {
   data: PaginatedResponse<T>;
}
