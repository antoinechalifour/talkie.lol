type ResultItem<T> =
  | {
      value: T;
      done: false;
    }
  | {
      value: undefined;
      done: true;
    };

type PullItem<T> = (resultItem: ResultItem<T>) => void;

export class PushableAsyncIterator<T> implements AsyncIterator<T> {
  private _isDone = false;
  private _pullQueue: PullItem<T>[] = [];
  private _pushQueue: T[] = [];

  pushValue(value: T) {
    if (this._hasItemToPull()) {
      const resolve = this._pullQueue.shift()!;

      resolve({ done: false, value });
    } else {
      this._pushQueue.push(value);
    }
  }

  next(): Promise<IteratorResult<T, any>> {
    if (this._isDone) return this.return();

    return this._pullValue();
  }

  return(): Promise<IteratorResult<T, any>> {
    this._markAsDone();
    this._emptyQueue();

    return Promise.resolve({ value: undefined, done: true });
  }

  throw(e?: Error): Promise<IteratorResult<T, any>> {
    this._markAsDone();
    this._emptyQueue();

    return Promise.reject(e);
  }

  private _markAsDone() {
    this._isDone = true;
  }

  private _emptyQueue() {
    if (this._isDone) return;

    this._isDone = true;
    this._pullQueue = [];
    this._pushQueue = [];
  }

  private _pullValue() {
    return new Promise<ResultItem<T>>((resolve) => {
      if (this._hasItemToPush()) {
        resolve({
          done: false,
          value: this._pushQueue.shift()!,
        });
      } else {
        this._pullQueue.push(resolve);
      }
    });
  }

  private _hasItemToPush() {
    return this._pushQueue.length > 0;
  }

  private _hasItemToPull() {
    return this._pullQueue.length > 0;
  }
}
