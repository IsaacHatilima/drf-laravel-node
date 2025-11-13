import {Router} from "express";
import RegisterController from "./controllers/auth/RegisterController";
import LoginController from "./controllers/auth/LoginController";
import MeController from "./controllers/auth/MeController";
import {AuthMiddleware} from "./middleware/authMiddleware";
import {AuthLimiter} from "./middleware/rateLimiter";
import VerifyEmailController from "./controllers/auth/VerifyEmailController";

const router = Router();

router.get("/login", AuthLimiter, LoginController);
router.post("/register", AuthLimiter, RegisterController);
router.get("/me", AuthMiddleware, MeController);
router.get("/verify-email", VerifyEmailController);

export default router;
