import { Router } from "express";
import { UserRouter } from "../modules/user/user.router";
import { CategoryRouter } from "../modules/categorie/category.router";
import { CustomerRouter } from "../modules/customer/customer.router";
import { AuthRouter } from "../modules/auth/auth.router";
import { FileUploadRouter } from "../modules/file-upload/file.router";
import { ImageRouter } from "../modules/images/router";
import { PhotoRouter } from "../modules/photo/photo.router";

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    router.use("/api/auth", AuthRouter.routes);
    router.use("/api/user", UserRouter.routes);
    router.use("/api/category", CategoryRouter.routes);
    router.use("/api/customer", CustomerRouter.routes);
    router.use("/api/image", ImageRouter.routes);

    // funciona
    router.use("/api/upload", FileUploadRouter.routes);

    // imagen y database
    router.use("/api/profile", PhotoRouter.routes);

    return router;
  }
}
