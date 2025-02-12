import { NextFunction, Request, Response } from 'express';
import { PhotoService } from './photo.service';
import { UploadedFile } from 'express-fileupload';
import { CustomError } from '../../shared/errors/custom-error';

export class PhotoController {
  constructor(public readonly profileService: PhotoService) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Internal server error' });
  };

  // async createProfile(req: Request, res: Response): Promise<Response> {
  //   try {
  //     if (!req.files || !req.files.image) {
  //       return res.status(400).json({ message: "No se envió ninguna imagen" });
  //     }
  //     const image = req.files.image as UploadedFile;
  //     const profile = await this.profileService.createProfile(req.body, image);
  //     return res.status(201).json({ profile });
  //   } catch (error) {
  //     console.error(error);
  //     return res.status(500).json({ message: "Error al crear el perfil" });
  //   }
  // }
  createProfile = (req: Request, res: Response) => {
    if (!req.files?.image) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const image = req.files.image as UploadedFile;
    this.profileService
      .createProfile(req.body, image)
      .then((profile) => res.status(201).json(profile))
      .catch((error) => this.handleError(error, res));
  };

  getAllProfiles = (req: Request, res: Response) => {
    this.profileService
      .getAllProfiles()
      .then((profiles) => res.json(profiles))
      .catch((error) => this.handleError(error, res));
  };

  getProfileById = (req: Request, res: Response) => {
    const { id } = req.params;
    this.profileService
      .getProfileById(id)
      .then((profiles) => res.json(profiles))
      .catch((error) => this.handleError(error, res));
  };

  // async updateProfile(req: Request, res: Response): Promise<Response> {
  //   try {
  //     const { id } = req.params;
  //     let image: UploadedFile | undefined;
  //     if (req.files && req.files.image) {
  //       image = req.files.image as UploadedFile;
  //     }
  //     const profile = await this.profileService.updateProfile(id, req.body, image);
  //     return res.status(200).json({ profile });
  //   } catch (error) {
  //     console.error(error);
  //     return res.status(500).json({ message: "Error al actualizar el perfil" });
  //   }
  // }

  updateProfile = (req: Request, res: Response) => {
    const { id } = req.params;
    let image: UploadedFile | undefined;
    if (req.files && req.files.image) {
      image = req.files.image as UploadedFile;
    }
    this.profileService
      .updateProfile(id, req.body, image)
      .then((profile) => res.json(profile))
      .catch((error) => this.handleError(error, res));
  };

  deleteProfile = (req: Request, res: Response) => {
    const { id } = req.params;
    this.profileService
      .deleteProfile(id)
      .then(() => res.json({ message: 'Profile deleted successfully' }))
      .catch((error) => this.handleError(error, res));
  };

  // async deleteProfile(req: Request, res: Response): Promise<Response> {
  //   try {
  //     const { id } = req.params;
  //     await this.profileService.deleteProfile(id);
  //     return res.status(200).json({ message: "Perfil eliminado" });
  //   } catch (error) {
  //     console.error(error);
  //     return res.status(500).json({ message: "Error al eliminar el perfil" });
  //   }
  // }
}
