import {PrismaClient} from "../../generated/prisma/client";
import bcrypt from "bcrypt";
import {generateAccessToken, generateRefreshToken} from "../../lib/jwt";

const prisma = new PrismaClient();

export class LoginService {
    constructor(private db: PrismaClient) {
    }

    async login(data: {
        email: string;
        password: string;
    }) {
        const user = await this.db.user.findFirst({
            where: {email: data.email},
            include: {profile: true},
        });

        if (!user) {
            throw new Error("INVALID_CREDENTIALS");
        }

        const valid = await bcrypt.compare(data.password, user.password);

        if (!valid) {
            throw new Error("INVALID_CREDENTIALS");
        }

        delete (user as any).password;

        const access_token = generateAccessToken({
            id: user.id,
            email: user.email,
        });

        const refresh_token = generateRefreshToken({
            id: user.id,
        });

        return {
            user,
            access_token,
            refresh_token,
        };
    }
}


