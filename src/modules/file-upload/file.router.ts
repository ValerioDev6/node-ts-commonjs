import { Request, Response, Router } from 'express';
import { FileUploadController } from './file-upload.controller';
import { FileUploadService } from './file.service';
import { FileUploadMiddleware } from '../../shared/middlewares/file.middleware';
import { TypeMiddleware } from '../../shared/middlewares/type.middleware';

export class FileUploadRouter {
  static get routes(): Router {
    const router = Router();
    const uploadService = new FileUploadService();
    const controller = new FileUploadController(uploadService);

    router.use(FileUploadMiddleware.containFiles);
    router.use(TypeMiddleware.validTypes(['users', 'products', 'categoiries']));

    router.post('/single/:type', (req, res) => {
      controller.uploadFile(req, res);
    });

    return router;
  }
}
