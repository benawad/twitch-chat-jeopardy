type Variant = "info" | "success" | "error";

export class AlertError extends Error {
  public extensions: Record<string, any>;
  variant: Variant;

  constructor(message: string, variant: Variant = "error") {
    super(message);

    this.name = "1";
    this.extensions = { code: "1", exception: { variant } };
  }
}
