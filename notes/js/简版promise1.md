## 简版 promise 的实现

这个为基础版的 promise 的实现,主要包含:

- resolve,reject
- then 链式调用 即 promise2 的处理

代码较为简单,但还有一些功能没有加入,后期陆续实现

```js
class Promise {
  constructor(executor) {
    if (typeof executor !== 'function') {
      throw new Error('resolver is not a function');
    }

    this.initValue();
    this.initBind();
    try {
      executor(this.resolve, this.reject);
    } catch (error) {
      this.reject(error);
    }
  }
  initBind() {
    this.resolve = this.resolve.bind(this);
    this.reject = this.reject.bind(this);
  }

  initValue() {
    // 初始值
    this.value = null;
    this.reason = null;
    this.state = Promise.PENDING;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];
  }

  resolve(value) {
    if (this.state === Promise.PENDING) {
      this.state = Promise.FULFILLED;
      this.value = value;
      this.onFulfilledCallbacks.forEach((fn) => fn(this.value));
    }
  }
  reject(reason) {
    if (this.state === Promise.PENDING) {
      this.state = Promise.REJECTED;
      this.reason = reason;
      this.onRejectedCallbacks.forEach((fn) => fn(this.reason));
    }
  }

  then(onFulfilled, onRejected) {
    // 参数校检
    if (typeof onFulfilled !== 'function') {
      onFulfilled = function (value) {
        return value;
      };
    }

    if (typeof onRejected !== 'function') {
      onRejected = function (reason) {
        throw reason;
      };
    }
    // 实现链式调用,且改变了then的值,必须通过新实例
    let promise2 = new Promise((resolve, reject) => {
      if (this.state == Promise.FULFILLED) {
        setTimeout(() => {
          try {
            const x = onFulfilled(this.value);
            Promise.resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      }
      if (this.state == Promise.REJECTED) {
        setTimeout(() => {
          try {
            const x = onRejected(this.reason);
            Promise.resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      }
      if (this.state === Promise.PENDING) {
        // push
        this.onFulfilledCallbacks.push((value) => {
          setTimeout(() => {
            try {
              const x = onFulfilled(value);
              Promise.resolvePromise(promise2, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          });
        });

        this.onRejectedCallbacks.push((reason) => {
          setTimeout(() => {
            try {
              const x = onRejected(reason); // reason or this.reason
              Promise.resolvePromise(promise2, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          });
        });
        //end
      }
    });

    return promise2;
  }
}

Promise.PENDING = 'pending';
Promise.REJECTED = 'rejected';
Promise.FULFILLED = 'fulfilled';
Promise.resolvePromise = function (promise2, x, resolve, reject) {
  if (promise2 === x) {
    reject(new TypeError('Chaining cycle detected for promise'));
  }

  let called = false;
  if (x instanceof Promise) {
    x.then(
      (value) => {
        // resolve(value);
        Promise.resolvePromise(promise2, value, resolve, reject);
      },
      (reason) => {
        reject(reason);
      }
    );
  } else if ((x !== null && typeof x === 'object') || typeof x === 'function') {
    // try {
    //   const then = x.then;
    //   if (typeof then === 'function') {
    //     then.call(
    //       x,
    //       (value) => {
    //         if (called) return;
    //         called = true;
    //         Promise.resolvePromise(promise2, value, resolve, reject);
    //       },
    //       (reason) => {
    //         if (called) return;
    //         called = true;
    //         reject(reason);
    //       }
    //     );
    //   } else {
    //     if (called) return;
    //     called = true;
    //     resolve(x);
    //   }
    // } catch (error) {
    //   if (called) return;
    //   called = true;
    //   reject(error);
    // }

    // x 为对象或函数
    try {
      const then = x.then;
      if (typeof then === 'function') {
        then.call(
          x,
          (value) => {
            if (called) return;
            called = true;
            Promise.resolvePromise(promise2, value, resolve, reject);
          },
          (reason) => {
            if (called) return;
            called = true;
            reject(reason);
          }
        );
      } else {
        if (called) return;
        called = true;
        resolve(x);
      }
    } catch (e) {
      if (called) return;
      called = true;
      reject(e);
    }
  } else {
    resolve(x);
  }
};

Promise.resolvePromise_ss = function (promise2, x, resolve, reject) {
  // x 与 promise 相等
  if (promise2 === x) {
    reject(new TypeError('Chaining cycle detected for promise'));
  }

  let called = false;
  if (x instanceof Promise) {
    // 判断 x 为 Promise
    x.then(
      (value) => {
        Promise.resolvePromise(promise2, value, resolve, reject);
      },
      (reason) => {
        reject(reason);
      }
    );
  } else if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
    // x 为对象或函数
    try {
      const then = x.then;
      if (typeof then === 'function') {
        then.call(
          x,
          (value) => {
            if (called) return;
            called = true;
            Promise.resolvePromise(promise2, value, resolve, reject);
          },
          (reason) => {
            if (called) return;
            called = true;
            reject(reason);
          }
        );
      } else {
        if (called) return;
        called = true;
        resolve(x);
      }
    } catch (e) {
      if (called) return;
      called = true;
      reject(e);
    }
  } else {
    resolve(x);
  }
};

Promise.defer = Promise.deferred = function () {
  let dfd = {};
  dfd.promise = new Promise((resolve, reject) => {
    dfd.resolve = resolve;
    dfd.reject = reject;
  });
  return dfd;
};
module.exports = Promise;
```
