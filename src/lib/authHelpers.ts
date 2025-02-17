import Cookies from "js-cookie";

export function setAuthToken(
  token: string,
  username: string,
  avatar_id: number,
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
  localStorage.setItem("avatar_id", avatar_id.toString());
}

export const clearAuthToken = (): void => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("username");
  localStorage.removeItem("avatar_id");
  Cookies.remove("auth-token");
};
