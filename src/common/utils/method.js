export function debounce(fn, wait = 300) {
  let timeout = null; // 创建一个定时器
  return () => {
    if(timeout) {
      clearTimeout(timeout); 
    }
    timeout = setTimeout(() => {
      fn.apply(this, arguments);
    }, wait);
  };
}

export function throttle(func, wait = 300) {
  let timeout = null;
  let context = null;
  let args = null;
  var previous = 0;

  var later = function() {
    previous = +new Date();
    timeout = null;
    func.apply(context, args)
  };

  var throttled = function() {
    var now = +new Date();
    //下次触发 func 剩余的时间
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;
    // 如果没有剩余的时间了或者你改了系统时间
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      func.apply(context, args);
    } else if (!timeout) {
      timeout = setTimeout(later, remaining);
    }
  };
  return throttled;
}