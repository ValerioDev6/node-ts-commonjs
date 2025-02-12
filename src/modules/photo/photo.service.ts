import { UploadedFile } from 'express-fileupload';
import { CustomError } from '../../shared/errors/custom-error';
import path from 'path';
import { Uuid } from '../../config/uuid.adpater';
import fs from 'fs';
import { envs, getRepositoryFactory } from '../../config';
import { ProfileEntity } from './entities/profile.entity';
import { Repository } from 'typeorm';
export class PhotoService {
  private readonly profileRepository: Repository<ProfileEntity>;

  constructor() {
    this.profileRepository = getRepositoryFactory(ProfileEntity);
  }

  private checkFolder(folderPath: string) {
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }
  }

  async createProfile(data: any, image: UploadedFile): Promise<ProfileEntity> {
    const { fileUrl } = await this.uploadSingle(image, 'uploads/profiles');

    const profile = this.profileRepository.create({
      title: data.title,
      descripcion: data.descripcion,
      imagePath: fileUrl,
    });

    await this.profileRepository.save(profile);
    return profile;
  }

  async getAllProfiles(): Promise<ProfileEntity[]> {
    try {
      const profiles = await this.profileRepository.find({
        order: { title: 'asc' },
      });
      return profiles;
    } catch (error) {
      console.error({ error });
      throw new CustomError(500, 'Error al obtener perfiles');
    }
  }

  async getProfileById(id: string): Promise<ProfileEntity | null> {
    try {
      const profile = this.profileRepository.findOne({
        where: { id: id },
      });
      if (!profile) {
        throw CustomError.notFound(`User not found with: ${id}`);
      }
      return profile;
    } catch (error) {
      throw CustomError.internalServe('Error al obtener el perfil');
    }
  }

  async uploadSingle(file: UploadedFile, folder: string = 'uploads', validExtension: string[] = ['png', 'jpg', 'jpeg', 'gif']) {
    try {
      const fileExtension = file.mimetype.split('/').at(1) ?? '';
      if (!validExtension.includes(fileExtension)) {
        throw CustomError.badRequest(`Invalid extension: ${fileExtension}`);
      }

      const destination = path.resolve(__dirname, '../../../', folder);
      this.checkFolder(destination);
      const fileName = `${Uuid.v4()}.${fileExtension}`;
      const filePath = `${destination}/${fileName}`;

      await file.mv(filePath);

      // Generar la URL accesible
      const fileUrl = `${envs.BASE_URL}/${folder}/${fileName}`;

      return { fileName, fileUrl };
    } catch (error) {
      console.log({ error });
      throw CustomError.internalServe('Error uploading file');
    }
  }

  async updateProfile(id: string, data: any, image?: UploadedFile): Promise<ProfileEntity> {
    try {
      const profile = await this.profileRepository.findOne({ where: { id } });
      if (!profile) {
        throw CustomError.notFound(`Profile not found with id: ${id}`);
      }

      if (image) {
        if (profile.imagePath) {
          const relativePath = profile.imagePath.replace(`${envs.BASE_URL}/`, '');
          const oldFilePath = path.resolve(__dirname, '../../../', relativePath);
          if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
          }
        }
        const { fileUrl } = await this.uploadSingle(image, 'uploads/profiles');
        profile.imagePath = fileUrl;
      }

      // Actualiza otros campos si vienen en el body
      if (data.title !== undefined) profile.title = data.title;
      if (data.descripcion !== undefined) profile.descripcion = data.descripcion;

      await this.profileRepository.save(profile);
      return profile;
    } catch (error) {
      console.error({ error });
      throw new CustomError(500, 'Error al actualizar el perfil');
    }
  }

  async deleteProfile(id: string): Promise<void> {
    try {
      const profile = await this.profileRepository.findOne({ where: { id } });
      if (!profile) {
        throw CustomError.notFound(`Profile not found with id: ${id}`);
      }

      if (profile.imagePath) {
        const relativePath = profile.imagePath.replace(`${envs.BASE_URL}/`, '');
        const filePath = path.resolve(__dirname, '../../../', relativePath);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      await this.profileRepository.remove(profile);
    } catch (error) {
      console.error({ error });
      throw new CustomError(500, 'Error al eliminar el perfil');
    }
  }
}
