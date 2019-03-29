/* eslint-disable import/prefer-default-export */

export const arraysEqual = (a1, a2) => a1.length === a2.length
  && a1.reduce((prev, it, index) => prev && it === a2[index], true);

export const wrapCall = async (contract, callFunc, ...args) => new Promise(
  (accept, reject) => contract[callFunc](...args, (err, data) => {
    if (err) {
      reject(err);
    } else {
      accept(data);
    }
  }),
);

export const wrapSubscription = (contract, callFunc, successHandler, errorHandler) => {
  contract[callFunc]((err, data) => {
    if (err) {
      if (errorHandler) {
        errorHandler(err);
      }
    } else if (successHandler) {
      successHandler(data);
    }
  });
};
