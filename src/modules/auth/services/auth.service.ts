import { UserEntity } from "../../user/entities/user.entity";
import { bcryptAdpater, envs, getRepositoryFactory } from "../../../config";
import { CustomError } from "../../../shared/errors/custom-error";
import { Repository } from "typeorm";
import { RegisterAuthDto } from "../../user/dto/register-auth.dto";
import { JWTAdapter } from "../../../config/jwt-adapter";
import { LoginUserDto } from "../dto/login-user.dto";
import { EmailService } from "./email.service";

export class AuthService {
  private readonly userRepository: Repository<UserEntity>;
  constructor(private readonly emailService: EmailService) {
    this.userRepository = getRepositoryFactory(UserEntity);
  }

   async loginUser(loginUserDto: LoginUserDto) {
    const user = await this.userRepository.findOne({
      where: { email: loginUserDto.email },
      select: {
        id: true,
        email: true,
        username: true,
        password: true,
        name: true,
        lastname: true,
        role: true,
        emailValidated: true,
      },
    });

    if (!user) throw CustomError.badRequest("Password no validos");

    const isMatch = bcryptAdpater.compare(loginUserDto.password, user.password);
    if (!isMatch) throw CustomError.badRequest("User and Password is not valid");

    const token = await JWTAdapter.generateToken({ id: user.id });
    if (!token) throw CustomError.internalServe("Error while creating JWT");

    const { password, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token: token,
    };
  }

  async createUser(createUserDto: RegisterAuthDto) {
    const userByEmail = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (userByEmail) throw CustomError.badRequest("Email already in use");

    const userByUsername = await this.userRepository.findOne({
      where: { username: createUserDto.username },
    });
    if (userByUsername) throw CustomError.badRequest("Username already exists");

    try {
      // hasheamos passowrd
      const hashedPassword = bcryptAdpater.hash(createUserDto.password);

      const userData = {
        ...createUserDto,
        password: hashedPassword,
      };

      // guardamos usuarios
      const user = this.userRepository.create(userData);
      await this.userRepository.save(user);

      // enviamos email alcoso
      this.sendEmailValidationLink(user.email);

      //jwt usuario
      const token = await JWTAdapter.generateToken({ id: user.id });
      if (!token) throw CustomError.internalServe("Error wile creating JWT");

      return {
        msg: true,
        user: user,
        token: token,
      };
    } catch (error) {
      throw CustomError.internalServe(`Internal Error ${error}`);
    }
  }

  private sendEmailValidationLink = async (email: string) => {
    const token = await JWTAdapter.generateToken({ email });
    if (!token) throw CustomError.internalServe("Error getting token");

    const link = `${envs.WEBSERVICE_URL}/auth/validate-email/${token}`;
    const html = `
        <h1>Validate your email</h1>
        <p>Click on the following to validate your email</p>
        <a href="${link}"> Validate your email </a>
    `;

    const options = {
      to: email,
      subject: "Validate your email",
      htmlBody: html,
    };

    const isSet = await this.emailService.sendEmail(options);
    if (!isSet) throw CustomError.internalServe("Error sending email");

    return true;
  };
  public async validateEmail(token: string) {
    const payload = await JWTAdapter.validateToken(token);
    if (!payload) throw CustomError.unauthorized("Invalid token");

    const { email } = payload as { email: string };
    if (!email) throw CustomError.internalServe("Email not in token");

    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) throw CustomError.badRequest("User not found");

    await this.userRepository.update({ email }, { emailValidated: true });

    return true;
  }
}
