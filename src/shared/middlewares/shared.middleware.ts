import { NextFunction, Request, Response } from "express";
import { Repository } from "typeorm";
import { UserEntity } from "../../modules/user/entities/user.entity";
import { JWTAdapter } from "../../config/jwt-adapter";

export class AuthMiddleware {
  constructor(private readonly userRepository: Repository<UserEntity>) {}

  validateJWT = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const authorization = req.header("Authorization");

    if (!authorization) {
      res.status(400).json({ error: "No token provided" });
      return;
    }

    if (!authorization.startsWith("Bearer ")) {
      res.status(401).json({ error: "Invalid token" });
      return;
    }

    const token = authorization.split(" ")[1];

    try {
      const payload = await JWTAdapter.validateToken<{ id: string }>(token);

      if (!payload) {
        res.status(401).json({ error: "Invalid token" });
        return;
      }

      const user = await this.userRepository.findOne({ where: { id: payload.id } });

      if (!user) {
        res.status(401).json({ error: "Invalid token - User not found" });
        return;
      }

      req.body.user = user;
      next();
    } catch (error) {
      console.error("Error validating token:", error);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
  };
}
