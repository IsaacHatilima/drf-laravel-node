import {PrismaClient} from "../generated/prisma/client";
import {RegisterService} from "../services/auth/RegisterService";
import {MeService} from "../services/auth/MeService";
import {LoginService} from "../services/auth/LoginService";
import {EmailVerificationService} from "../services/auth/EmailVerificationService";

class Container {
    prisma = new PrismaClient();

    loginService = new LoginService(this.prisma);
    registerService = new RegisterService(this.prisma);
    emailVerificationService = new EmailVerificationService(this.prisma);
    meService = new MeService(this.prisma);
}

export const container = new Container();
