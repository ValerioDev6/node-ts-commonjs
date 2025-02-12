import { NextFunction, Request, Response } from 'express';
import { RoleType } from '../../modules/user/dto/rol.enum';

export class RoleMiddleware {
  static checkRole = (allowedRoles: RoleType[]) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        // Verificamos que el usuario existe en el request
        const user = req.body.user;

        if (!user) {
          res.status(401).json({ error: 'No user found in request' });
          return;
        }

        // Verificamos si el rol del usuario está en los roles permitidos
        if (!allowedRoles.includes(user.role)) {
          res.status(403).json({
            error: `User role ${user.role} is not authorized. Required roles: ${allowedRoles.join(', ')}`,
          });
          return;
        }

        next();
      } catch (error) {
        res.status(500).json({ error: 'Internal server error checking roles' });
        return;
      }
    };
  };
}
