export function flushPromises() {
  return new Promise((res) => setImmediate(res));
}
