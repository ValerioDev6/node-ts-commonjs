import { Request, Response, Router } from "express";
import { UserService } from "./services/user.service";
import { UserController } from "./controllers/users.controller";
import { MiddlewareFactory } from "../../config/middleware-factory";
import { RoleMiddleware } from "../../shared/middlewares/role.midlleware";
import { RoleType } from "./dto/rol.enum";

export class UserRouter {
  static get routes(): Router {
    const router = Router();
    const usersService = new UserService();
    const controller = new UserController(usersService);
    const { validateJWT } = MiddlewareFactory.getAuthMiddleware();

    router.get("/", [validateJWT, RoleMiddleware.checkRole([RoleType.ADMIN, RoleType.CUSTOMER])], (req: Request, res: Response) => {
      controller.getUsersPagination(req, res);
    });

    router.get("/relacion/:id", (req, res) => {
      controller.getUserWithRelationById(req, res);
    });

    router.post("/", (req, res) => {
      controller.createUser(req, res);
    });

    return router;
  }
}
