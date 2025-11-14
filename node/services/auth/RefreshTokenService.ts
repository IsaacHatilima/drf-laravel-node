import {PrismaClient} from "../../generated/prisma/client";
import jwt from "jsonwebtoken";
import {refreshAccessToken, refreshRefreshToken} from "../../lib/jwt";

export class RefreshTokenService {
    constructor(private db: PrismaClient) {
    }

    async refresh(refreshToken: string) {
        try {
            const stored = await this.db.refreshToken.findUnique({
                where: {token: refreshToken}
            });

            if (!stored || stored.revoked) {
                return this.invalidate(refreshToken);
            }

            let decoded;
            try {
                decoded = jwt.verify(refreshToken, process.env.APP_KEY as string) as {
                    id: string;
                    email: string;
                };
            } catch {
                return this.invalidate(refreshToken);
            }

            const newRefresh = refreshRefreshToken({id: decoded.id, email: decoded.email});

            await this.db.refreshToken.update({
                where: {token: refreshToken},
                data: {revoked: true}
            });

            await this.db.refreshToken.create({
                data: {
                    userId: decoded.id,
                    token: newRefresh,
                    expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000)
                }
            });


            const newAccess = refreshAccessToken({id: decoded.id, email: decoded.email});

            return {
                access_token: newAccess,
                refresh_token: newRefresh
            };
        } catch (e) {
            throw new Error("INVALID_OR_EXPIRED_REFRESH_TOKEN");
        }
    }

    private async invalidate(refreshToken: string): Promise<never> {
        await this.db.refreshToken.update({
            where: {token: refreshToken},
            data: {revoked: true}
        });

        throw new Error("INVALID_REFRESH_TOKEN");
    }
}
