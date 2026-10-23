export class RequestBodyTooLargeError extends Error {
  constructor() {
    super("Request body is too large.");
    this.name = "RequestBodyTooLargeError";
  }
}

export class InvalidJsonBodyError extends Error {
  constructor() {
    super("Request body must contain valid JSON.");
    this.name = "InvalidJsonBodyError";
  }
}

export async function readJsonBody<T>(request: Request, maxBytes: number): Promise<T> {
  const declaredLength = Number(request.headers.get("content-length") || 0);
  if (declaredLength > maxBytes) throw new RequestBodyTooLargeError();

  const text = await request.text();
  if (new TextEncoder().encode(text).byteLength > maxBytes) {
    throw new RequestBodyTooLargeError();
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new InvalidJsonBodyError();
  }
}
