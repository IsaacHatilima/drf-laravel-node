import jwt from "jsonwebtoken";


const accessSecret = process.env.APP_KEY as string;
const refreshSecret = process.env.APP_KEY as string;

const accessExpires = (process.env.JWT_ACCESS_EXPIRES_IN ?? "15m") as jwt.SignOptions["expiresIn"];
const refreshExpires = (process.env.JWT_REFRESH_EXPIRES_IN ?? "7d") as jwt.SignOptions["expiresIn"];

export function generateAccessToken(payload: any) {
    return jwt.sign(payload, accessSecret, {expiresIn: accessExpires});
}

export function generateRefreshToken(payload: any) {
    return jwt.sign(payload, refreshSecret, {expiresIn: refreshExpires});
}