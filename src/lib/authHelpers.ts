import Cookies from "js-cookie";

export function setAuthToken(
  token: string,
  username: string,
  persistent: boolean = false
): void {
  const cookieOptions = {
    secure: true,
    sameSite: "lax" as const,
    expires: persistent ? 30 : undefined,
  };

  Cookies.set("auth-token", token, cookieOptions);
  localStorage.setItem("access_token", token);
  localStorage.setItem("username", username);
}

export const clearAuthToken = (): void => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("username");
  Cookies.remove("auth-token");
};
