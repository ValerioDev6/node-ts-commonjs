import { regularExps } from "../../../config/regular-exp";
import { RoleType } from "../dto/rol.enum";

export class RegisterAuthDto {
  private constructor(
    public readonly name: string,
    public readonly lastname: string,
    public readonly username: string,
    public readonly email: string,
    public readonly password: string,
    public readonly age: number,
    public readonly city: string,
    public readonly province: string,
    public readonly role: RoleType = RoleType.USER,
  ) {}

  static create(object: { [key: string]: any }): [string?, RegisterAuthDto?] {
    const { name, lastname, username, email, password, age, city, province, role = RoleType.USER } = object;

    if (!name) return ["Missing name", undefined];
    if (!lastname) return ["Missing lastname", undefined];
    if (!username) return ["Missing username", undefined];
    if (!email) return ["Missing email", undefined];
    if (!regularExps.email.test(email)) return ["Email is not valid", undefined];
    if (!password) return ["Missing password", undefined];
    if (password.length < 6) return ["Password too short", undefined];
    if (!age) return ["Missing age", undefined];
    if (!city) return ["Missing city", undefined];
    if (!province) return ["Missing province", undefined];

    return [undefined, new RegisterAuthDto(name, lastname, username, email, password, age, city, province, role)];
  }
}
