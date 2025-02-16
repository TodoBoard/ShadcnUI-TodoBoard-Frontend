export const env = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL as string,
  jwtSecretKey: process.env.JWT_SECRET_KEY as string,

  validate() {
    if (!process.env.NEXT_PUBLIC_API_URL) {
      throw new Error("NEXT_PUBLIC_API_URL is not defined");
    }
  },
};

export const validateServerEnv = () => {
  if (!process.env.JWT_SECRET_KEY) {
    throw new Error("JWT_SECRET_KEY is not defined");
  }
};

env.validate();
