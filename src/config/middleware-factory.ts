import { UserEntity } from "../modules/user/entities/user.entity";
import { AuthMiddleware } from "../shared/middlewares/shared.middleware";
import { getRepositoryFactory } from "./repository.config";

export class MiddlewareFactory {
  private static authMiddlewareInstance: AuthMiddleware;

  static getAuthMiddleware(): AuthMiddleware {
    if (!this.authMiddlewareInstance) {
      const userRepository = getRepositoryFactory(UserEntity);
      this.authMiddlewareInstance = new AuthMiddleware(userRepository);
    }
    return this.authMiddlewareInstance;
  }
}
