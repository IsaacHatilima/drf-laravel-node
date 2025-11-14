import "dotenv/config";

const APP_KEY = process.env.APP_KEY;
const JWT_ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || "15m";
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || "7d";

if (!APP_KEY) {
    throw new Error("APP_KEY is missing in .env");
}

export const env = {
    APP_KEY,
    JWT_ACCESS_EXPIRES_IN,
    JWT_REFRESH_EXPIRES_IN,
};
