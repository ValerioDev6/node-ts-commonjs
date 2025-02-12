import { Router } from 'express';
import { PhotoController } from './controller';
import { PhotoService } from './photo.service';

export class PhotoRouter {
  static get routes(): Router {
    const router = Router();
    const photoService = new PhotoService();
    const controller = new PhotoController(photoService);

    router.get('/', (req, res) => {
      controller.getAllProfiles(req, res);
    });

    router.get('/:id', (req, res) => {
      controller.getProfileById(req, res);
    });

    router.post('/', (req, res) => {
      controller.createProfile(req, res);
    });

    router.put('/:id', (req, res) => {
      controller.updateProfile(req, res);
    });

    router.delete('/:id', (req, res) => {
      controller.deleteProfile(req, res);
    });

    return router;
  }
}
