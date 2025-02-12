import { Request, Response, Router } from "express";
import { envs } from "../../config";
import { EmailService } from "./services/email.service";
import { AuthService } from "./services/auth.service";
import { AuthController } from "./controller/auth.controller";
import { MiddlewareFactory } from "../../config/middleware-factory";

export class AuthRouter {
  static get routes(): Router {
    const router = Router();
    const emailService = new EmailService(envs.MAILER_SERVICE, envs.MAILER_EMAIL, envs.MAILER_SECRET_KEY);
    const authService = new AuthService(emailService);
    const controller = new AuthController(authService);
    const { validateJWT } = MiddlewareFactory.getAuthMiddleware();

    router.post("/login", controller.loginUser);

    router.post("/register", (req, res) => {
      controller.createUser(req, res);
    });

    router.get("/validate-email/:token", (req, res) => {
      controller.validateEmail(req, res);
    });

    router.get("/private", [validateJWT], (req: Request, res: Response) => {
      controller.getProfile(req, res);
    });

    return router;
  }
}
