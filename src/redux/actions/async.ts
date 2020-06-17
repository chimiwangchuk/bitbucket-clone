export type AsyncAction = {
  REQUEST: string;
  SUCCESS: string;
  ERROR: string;
};

export function createAsyncAction(action: string): AsyncAction {
  return {
    REQUEST: `${action}_REQUEST`,
    SUCCESS: `${action}_SUCCESS`,
    ERROR: `${action}_ERROR`,
  };
}

// We can simplify the above type to this if we use the type Either<A, B> for the result of an action.
// We can model success/failure and store data/errors that way. LOAD_WATCH, uses this approach.
export type AsyncActionE = {
  BEGIN: string;
  END: string;
};

export function createAsyncActionE(action: string): AsyncActionE {
  return {
    BEGIN: `${action}_BEGIN`,
    END: `${action}_END`,
  };
}
