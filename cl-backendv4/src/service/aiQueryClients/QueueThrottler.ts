import pLimit from "p-limit";

// Higher-order function that returns a throttled version of the passed function
export function createThrottledFunction<
  T extends (...args: any[]) => Promise<any>
>(
  fn: T,
  concurrency: number = 5,
  delayMs: number = 2000 // 1 second
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  const callQueue: Array<() => void> = [];
  const limit = pLimit(5);

  let batchInProgress = false;

  const processQueue = async () => {
    if (batchInProgress || callQueue.length === 0) {
      return;
    }

    // Mark that a batch is in progress
    batchInProgress = true;

    while (callQueue.length > 0) {
      // Only allow up to `concurrency` number of concurrent calls
      const promises: Promise<any>[] = [];
      const batch = Math.min(concurrency, callQueue.length);

      // Create a batch of promises and limit the concurrent calls
      for (let i = 0; i < batch; i++) {
        const nextFn = callQueue.shift();
        if (nextFn) {
          const promise = limit(nextFn);
          promises.push(promise);
        }
      }

      // Wait for the entire batch to finish
      await Promise.all(promises);

      if (callQueue.length > 0) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }

    batchInProgress = false;

    // Process the next batch if any calls are left in the queue
    if (callQueue.length > 0) {
      processQueue();
    }
  };

  // Return a throttled function that enqueues calls
  return function (this: unknown, ...args: Parameters<T>) {
    return new Promise<ReturnType<T>>((resolve, reject) => {
      // Use .bind(this) to preserve the context of 'this'
      const wrappedFn = () => fn.apply(this, args).then(resolve).catch(reject);

      callQueue.push(wrappedFn.bind(this));
      processQueue(); // Start processing the queue if necessary
    });
  };
}
