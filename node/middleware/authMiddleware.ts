import {NextFunction, Request, Response} from "express";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
    user?: { id: string; email: string };
}

export function AuthMiddleware(
    req: AuthRequest,
    res: Response,
    next: NextFunction
) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({errors: ["Unauthorized"]});
    }

    const token = authHeader.split(" ")[1];

    try {
        req.user = jwt.verify(
            token,
            process.env.APP_KEY as string
        ) as { id: string; email: string };
        next();

    } catch (error) {
        return res.status(401).json({errors: ["Invalid or expired token"]});
    }
}
