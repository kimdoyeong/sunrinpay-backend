import createError from "./createError";

export const AuthError = createError("인증에 실패했습니다.", 401);
export const UserNotFoundError = createError("유저를 찾을 수 없습니다.", 404);
export const PaymentTokenGenerateError = createError(
  "결제 토큰을 만들 수 없습니다.",
  500
);
export const TokenValidError = createError("유효하지 않은 토큰입니다.", 401);
export const PaymentTokenValidError = createError(
  "유효하지 않은 결제 토큰입니다.",
  401
);
export const PaymentTokenTimeoutError = createError(
  "유효 기간이 지난 결제 토큰입니다.",
  403
);
export const RequiredError = (name: string) =>
  createError(`${name} 항목은 필수입니다.`, 400);
export const UserAlreadyExist = createError("이미 존재하는 유저입니다.", 409);
