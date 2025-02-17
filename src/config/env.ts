export const clientEnv = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL as string,
  inviteUrl: process.env.NEXT_PUBLIC_INVITE_URL as string,

  validate() {
    if (!process.env.NEXT_PUBLIC_API_URL) {
      throw new Error("NEXT_PUBLIC_API_URL is not defined");
    }
    if (!process.env.NEXT_PUBLIC_INVITE_URL) {
      throw new Error("NEXT_PUBLIC_INVITE_URL is not defined");
    }
  },
};

export const serverEnv = {
  jwtSecretKey: process.env.JWT_SECRET_KEY as string,

  validate() {
    if (!process.env.JWT_SECRET_KEY) {
      throw new Error("JWT_SECRET_KEY is not defined");
    }
  },
};

export const env = {
  ...clientEnv,
  ...serverEnv,
};

if (typeof window !== "undefined") {
  clientEnv.validate();
}
