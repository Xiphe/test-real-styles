export function withTimeout<PromisedValue extends any>(
  promisedValue: Promise<PromisedValue>,
  message: string = 'Timed out after %n',
  timeout: number = 10_000,
): Promise<PromisedValue> {
  return Promise.race([
    promisedValue,
    new Promise<never>((_, rej) =>
      setTimeout(
        () =>
          rej(
            new Error(
              message.replace(
                '%n',
                timeout >= 1000
                  ? `${Math.round(timeout / 1000)}s`
                  : `${timeout}ms`,
              ),
            ),
          ),
        timeout,
      ),
    ),
  ]);
}
