/**
 *  Delay a function to execute for a given amount of time
 */

const debounce = (func, delay = 500) => {
  let timerID = null;
  return (...args) => {
    if (timerID) {
      clearTimeout(timerID);
      timerID = null;
    }

    timerID = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};

export default debounce;
