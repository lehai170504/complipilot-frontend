import Cookies from "js-cookie";

const ACCESS_TOKEN_KEY = "complipilot_access_token";
const REFRESH_TOKEN_KEY = "complipilot_refresh_token";

const isProduction = process.env.NODE_ENV === "production";

const cookieOptions: Cookies.CookieAttributes = {
  sameSite: "strict",
  secure: isProduction,
  expires: 30,
  path: "/",
};

export function getAccessToken(): string | undefined {
  return Cookies.get(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | undefined {
  return Cookies.get(REFRESH_TOKEN_KEY);
}

export function setAuthCookies(accessToken: string, refreshToken: string): void {
  Cookies.set(ACCESS_TOKEN_KEY, accessToken, cookieOptions);
  Cookies.set(REFRESH_TOKEN_KEY, refreshToken, cookieOptions);
}

export function clearAuthCookies(): void {
  Cookies.remove(ACCESS_TOKEN_KEY, { path: "/" });
  Cookies.remove(REFRESH_TOKEN_KEY, { path: "/" });
}

export function hasAuthCookies(): boolean {
  return Boolean(getAccessToken() && getRefreshToken());
}