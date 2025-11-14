import {PrismaClient} from "../../generated/prisma/client";
import jwt from "jsonwebtoken";
import {refreshAccessToken, refreshRefreshToken} from "../../lib/jwt";

export class RefreshTokenService {
    constructor(private db: PrismaClient) {
    }

    refresh(refreshToken: string) {
        try {
            const decoded = jwt.verify(
                refreshToken,
                process.env.APP_KEY as string
            ) as { id: string; email: string };

            const newAccess = refreshAccessToken({id: decoded.id, email: decoded.email});

            const newRefresh = refreshRefreshToken({id: decoded.id, email: decoded.email});

            return {
                access_token: newAccess,
                refresh_token: newRefresh,
            };
        } catch (e) {
            throw new Error("INVALID_OR_EXPIRED_REFRESH_TOKEN");
        }
    }
}
