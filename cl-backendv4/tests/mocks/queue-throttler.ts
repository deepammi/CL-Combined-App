// Mock implementation of QueueThrottler.ts
export function createThrottledFunction(fn: any, concurrency = 5) {
  return async (...args: any[]) => {
    return fn(...args);
  };
}

export function createRateLimitedFunction(fn: any, requestsPerSecond = 2) {
  return async (...args: any[]) => {
    return fn(...args);
  };
}

export function createThrottledQueue(concurrency = 5) {
  return {
    add: async (fn: any) => {
      return fn();
    },
    onEmpty: async () => {
      return Promise.resolve();
    },
    onIdle: async () => {
      return Promise.resolve();
    },
    size: 0,
    pending: 0,
    isPaused: false,
    pause: () => {},
    resume: () => {},
    clear: () => {},
  };
} 