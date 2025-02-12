import { NextFunction, Request, Response } from "express";
import { UserService } from "../../user/services/user.service";
import { RegisterUserDto } from "../../user/dto/register-user.dto";
import { bcryptAdpater } from "../../../config";
import { CustomError } from "../../../shared/errors/custom-error";
import { RegisterAuthDto } from "../../user/dto/register-auth.dto";
import { LoginUserDto } from "../dto/login-user.dto";
import { getNameOfDeclaration } from "typescript";
import { AuthService } from "../services/auth.service";

export class AuthController {
  constructor(private readonly auth2Service: AuthService) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    return res.status(500).json({ error: "Internal server error" });
  };

  createUser = (req: Request, res: Response) => {
    const [error, userRegisterDto] = RegisterAuthDto.create(req.body);

    if (error) {
      return res.status(400).json({ error });
    }
    this.auth2Service
      .createUser(userRegisterDto!)
      .then((result) => res.status(201).json(result))
      .catch((error) => this.handleError(error, res));
  };

  loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const [error, loginUserDto] = LoginUserDto.create(req.body);
      if (error) {
        res.status(400).json({ error });
        return;
      }
      const user = await this.auth2Service.loginUser(loginUserDto!);
      res.json(user);
    } catch (error) {
      this.handleError(error, res);
    }
  };
  // loginUser = (req: Request, res: Response) => {
  //   const [error, loginUserDto] = LoginUserDto.create(req.body);
  //   if (error) return res.status(400).json({ error });

  //   this.auth2Service
  //     .loginUser(loginUserDto!)
  //     .then((user) => res.json(user))
  //     .catch((error) => this.handleError(error, res));
  // };
  // Método de prueba protegido

  validateEmail = (req: Request, res: Response) => {
    const { token } = req.params;
    this.auth2Service
      .validateEmail(token)
      .then(() => res.json("Email validated"))
      .catch((error) => this.handleError(error, res));
  };

  //  Método de prueba protegido
  async getProfile(req: Request, res: Response) {
    return res.json({
      message: true,
      resp: "HOLA ADMIN",
    });
  }
  // getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  //   try {
  //     res.json({
  //       message: true,
  //       resp: "HOLA ADMIN",
  //     });
  //   } catch (error) {
  //     this.handleError(error, res);
  //   }
  // };
  // Método de prueba protegido
  async getAdmin(req: Request, res: Response) {
    return res.json({
      message: true,
      resp: "HOLA RUTA PROTEGITA",
    });
  }
}
