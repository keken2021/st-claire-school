export interface ActionState {
  status: "idle" | "success" | "error";
  message?: string;
  /** Non-blocking observations, such as two classes colliding. */
  warnings?: string[];
  fieldErrors?: Record<string, string[]>;
}

export const idleState: ActionState = { status: "idle" };
