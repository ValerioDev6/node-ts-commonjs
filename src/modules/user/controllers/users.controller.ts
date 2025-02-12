import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { CustomError } from "../../../shared/errors/custom-error";
import { PaginationDto } from "../../../shared/dtos/pagination.dto";
import { RegisterUserDto } from "../dto/register-user.dto";

export class UserController {
  constructor(public readonly userService: UserService) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    return res.status(500).json({ error: "Internal server error" });
  };

  getUsersPagination = (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;
    const [error, paginationDto] = PaginationDto.create(+page, +limit);
    if (error) return res.status(400).json({ error });

    this.userService
      .findAllUsersPagination(paginationDto!)
      .then((products) => res.json(products))
      .catch((error) => this.handleError(error, res));
  };

  getUsers = (req: Request, res: Response) => {
    this.userService
      .findAllUser()
      .then((user) => res.json(user))
      .catch((error) => this.handleError(error, res));
  };

  createUser = (req: Request, res: Response) => {
    const [error, userRegisterDto] = RegisterUserDto.create(req.body);
    if (error) return res.status(400).json({ error });

    this.userService
      .createUser(userRegisterDto!)
      .then((user) => res.status(201).json(user))
      .catch((error) => this.handleError(error, res));
  };

  getUserWithRelationById = (req: Request, res: Response) => {
    const { id } = req.params;
    this.userService
      .finUserWithRelation(id)
      .then((user) => res.json(user))
      .catch((error) => this.handleError(error, res));
  };
}
