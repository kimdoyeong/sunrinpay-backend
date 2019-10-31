function createError(message: string, status = 500) {
  const error = new Error(message);
  (error as any).status = status;
  (error as any).expose = true;

  return error;
}
export default createError;
