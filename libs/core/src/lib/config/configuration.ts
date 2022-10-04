export const configuration = () => ({
    environment: process.env.NODE_ENV,
    port: parseInt(process.env.PORT_API || "3000", 10),
    jwt_secret: process.env.JWT_SECRET,
    refresh_jwt_secret: process.env.REFRESH_JWT_SECRET,
    expires_in: process.env.EXPIRES_IN,
    refresh_expires_in: process.env.REFRESH_EXPIRES_IN,
  });