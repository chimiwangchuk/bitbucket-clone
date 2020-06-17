export enum HttpMethods {
  get = 'GET',
  head = 'HEAD',
  post = 'POST',
  put = 'PUT',
  delete = 'DELETE',
  connect = 'CONNECT',
  options = 'OPTIONS',
  trace = 'TRACE',
  patch = 'PATCH',
}

export type HttpError = {
  status: number;
  msg: string;
};
