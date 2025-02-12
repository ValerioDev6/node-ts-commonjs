import { Router } from "express";
import { ImagesController } from "./controller";

export class ImageRouter {
  static get routes(): Router {
    const router = Router();
    const controller = new ImagesController();

    router.get("/:type/:img", (req, res) => {
      controller.getImage(req, res);
    });

    return router;
  }
}
