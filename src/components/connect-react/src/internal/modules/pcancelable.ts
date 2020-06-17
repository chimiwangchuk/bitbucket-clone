/* eslint-disable no-underscore-dangle */
export class CancelError extends Error {
  constructor() {
    super('Promise was canceled');
    this.name = 'CancelError';
  }
}

export default class PCancelable {
  private _pending: boolean;
  private _canceled: boolean;
  private _cancel: () => Promise<any>;
  private _reject: (reason?: any) => void;
  private _promise: Promise<any>;

  static fn(fn: () => Promise<any>): () => PCancelable {
    return (...args: any[]) => {
      return new PCancelable((onCancel, resolve, reject) => {
        args.unshift(onCancel);
        // eslint-disable-next-line prefer-spread
        fn.apply(null, args).then(resolve, reject);
      });
    };
  }

  constructor(
    executor: (
      onCancel: (fn: () => Promise<any>) => void,
      resolve: (fn: () => Promise<any>) => void,
      reject: (fn: () => Promise<any>) => void
    ) => void
  ) {
    this._pending = true;
    this._canceled = false;

    this._promise = new Promise((resolve, reject) => {
      this._reject = reject;

      return executor(
        fn => {
          this._cancel = fn;
        },
        val => {
          this._pending = false;
          resolve(val);
        },
        err => {
          this._pending = false;
          reject(err);
        }
      );
    });
  }

  then(onFulfilled?: (value: any) => any, onRejected?: (value: any) => any) {
    return this._promise.then.call(this._promise, onFulfilled, onRejected);
  }

  catch(error: (reason: any) => any) {
    return this._promise.catch.call(this._promise, error);
  }

  cancel() {
    if (!this._pending || this._canceled) {
      return;
    }

    if (typeof this._cancel === 'function') {
      try {
        this._cancel();
      } catch (err) {
        this._reject(err);
      }
    }

    this._canceled = true;
    this._reject(new CancelError());
  }

  get canceled() {
    return this._canceled;
  }
}

Object.setPrototypeOf(PCancelable.prototype, Promise.prototype);
