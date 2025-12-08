/* eslint-disable no-restricted-globals */
self.onmessage = (e: MessageEvent) => {
  const { type, payload } = e.data;

  if (type === "START") {
    const { duration } = payload;
    let timeLeft = duration;

    // Clear any existing interval
    if ((self as any).timerInterval) {
      clearInterval((self as any).timerInterval);
    }

    (self as any).timerInterval = setInterval(() => {
      timeLeft -= 1;
      self.postMessage({ type: "TICK", payload: { timeLeft } });

      if (timeLeft <= 0) {
        clearInterval((self as any).timerInterval);
        self.postMessage({ type: "COMPLETE" });
      }
    }, 1000);
  } else if (type === "PAUSE" || type === "STOP") {
    if ((self as any).timerInterval) {
      clearInterval((self as any).timerInterval);
    }
  }
};
