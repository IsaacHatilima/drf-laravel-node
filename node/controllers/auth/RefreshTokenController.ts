import {Request, Response} from "express";
import {container} from "../../lib/container";

export default async function RefreshTokenController(req: Request, res: Response) {
    try {
        const {refresh_token} = req.body;

        if (!refresh_token) {
            return res.status(422).json({errors: ["Refresh token is required"]});
        }

        const tokens = container.refreshTokenService.refresh(refresh_token);

        return res.json({
            message: "Token refreshed",
            ...tokens,
        });

    } catch (e: any) {
        if (e.message === "INVALID_OR_EXPIRED_REFRESH_TOKEN") {
            return res.status(401).json({errors: ["Invalid or expired refresh token"]});
        }

        console.error(e);
        return res.status(500).json({errors: ["Something went wrong"]});
    }
}
