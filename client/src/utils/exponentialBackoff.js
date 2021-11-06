import sleep from "./sleep";

export default function exponentialBackoff(operation, { jitter, maxRetries = 10, baseDelay = 500, maxDelay = 7000, }) {
  let currentAttempt = 0;
    (async function retry() {
      let currentDelay = Math.min(baseDelay * currentAttempt, maxDelay);
      let jitterValue = 0;
      if (jitter) {
          jitterValue = Math.round(Math.random() * 400);
          currentDelay += jitterValue;
      }
      try {
          console.log(`Retry attempt ${currentAttempt} with delay ${baseDelay * currentAttempt} and jitter ${jitterValue}`);
          await sleep(currentDelay);
          return await operation();
      }
      catch (err) {
        console.error(err);
        if (currentAttempt === maxRetries) {
            throw new Error(`Service unavailable.`);
        }
        currentAttempt += 1;
        retry();
      }
  })();
}