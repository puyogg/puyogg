export type Result<T, E extends Error = Error> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: E;
    };
