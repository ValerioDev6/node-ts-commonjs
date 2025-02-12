import { Repository } from "typeorm";
import { UserEntity } from "../entities/user.entity";
import { RoleType } from "../dto/rol.enum";
import { bcryptAdpater, getRepositoryFactory } from "../../../config";
import { CustomError } from "../../../shared/errors/custom-error";
import { PaginationDto } from "../../../shared/dtos/pagination.dto";
import { RegisterUserDto } from "../dto/register-user.dto";

export class UserService {
  private readonly userRepository: Repository<UserEntity>;

  constructor() {
    this.userRepository = getRepositoryFactory(UserEntity);
  }
  async findAllUser(): Promise<UserEntity[]> {
    try {
      const users = await this.userRepository.find({
        order: { name: "ASC" },
      });
      return users;
    } catch (error) {
      console.error(error);
      throw new CustomError(500, "Error al obtener usuarios");
    }
  }

  async findAllUsersPagination(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    try {
      const [users, total] = await this.userRepository.findAndCount({
        skip: (page - 1) * limit,
        take: limit,
        order: { name: "ASC" },
      });

      return {
        page,
        limit,
        total,
        next: `${process.env.URL_ENV}/api/usuarios?page=${page + 1}&limit=${limit}`,
        prev: page - 1 > 0 ? `${process.env.URL_ENV}/api/usuarios?page=${page - 1}&limit=${limit}` : null,
        users: users.map((user) => ({
          ...user,
        })),
      };
    } catch (error) {
      console.error(error);
      throw new CustomError(500, "Error al obtener usuarios");
    }
  }

  async createUser(createUserDto: RegisterUserDto): Promise<UserEntity> {
    const userExists = await this.userRepository.findOne({
      where: { name: createUserDto.name },
    });
    if (userExists) throw CustomError.badRequest("User already exists");

    const userEmailExist = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (userEmailExist) throw CustomError.badRequest("User email already exists");

    try {
      const hashedPassword = bcryptAdpater.hash(createUserDto.password);

      const userData = {
        ...createUserDto,
        password: hashedPassword,
        role: createUserDto.role as RoleType,
      };

      const user = this.userRepository.create(userData);
      await this.userRepository.save(user);
      return user;
    } catch (error) {
      throw CustomError.internalServe(`Internal Error ${error}`);
    }
  }

  async finUserWithRelation(id: string): Promise<UserEntity | null> {
    const user = await this.userRepository.createQueryBuilder("user").leftJoinAndSelect("user.customer", "customer").where({ id }).getOne();
    console.log({ user });

    return user;
  }

  async findUserByEmail(email: string): Promise<UserEntity | null> {
    return await this.userRepository.createQueryBuilder("user").addSelect("user.password").where({ email }).getOne();
  }

  async findUserByName(username: string): Promise<UserEntity | null> {
    return await this.userRepository.createQueryBuilder("user").addSelect("user.password").where({ username }).getOne();
  }

  async findUserWithRole(id: string, role: RoleType): Promise<UserEntity | null> {
    return await this.userRepository.createQueryBuilder("user").where({ id }).andWhere({ role }).getOne();
  }

  async findUserByID(id: string): Promise<UserEntity | null> {
    const user = this.userRepository.findOne({
      where: { id: id },
    });

    if (!user) {
      throw CustomError.notFound(`User not found wuth: ${id}`);
    }

    return user;
  }
}
