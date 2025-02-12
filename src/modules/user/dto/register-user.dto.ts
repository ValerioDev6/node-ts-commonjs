// import { RoleType } from "./rol.enum";

import { registerUserSchema } from './create-user.dto';

// export class RegisterUserDto {
//   constructor(
//     public name: string,
//     public username: string,
//     public lastname: string,
//     public email: string,
//     public password: string,
//     public city: string,
//     public province: string,
//     public age: number,
//     public role: RoleType

//   ) {}

//   static create(object: { [key: string]: any }): [string?, RegisterUserDto?] {
//     const {
//       name,
//       username,
//       lastname,
//       email,
//       password,
//       city,
//       province,
//       age,
//       role,
//     } = object;

//     if (!name) return ["El nombre es requerido"];
//     if (!username) return ["El nombre de usuario es requerido"];
//     if (!lastname) return ["El apellido es requerido"];
//     if (!email) return ["El email es requerido"];
//     if (!password) return ["La contraseña es requerida"];
//     if (!city) return ["La ciudad es requerida"];
//     if (!province) return ["La provincia es requerida"];
//     if (!age) return ["La edad es requerida"];
//     if (typeof age !== "number" || age < 0)
//       return ["La edad debe ser un número válido"];
//     if (!role) return ["El rol es requerido"];

//     if (role !== 'USER' && role !== 'CUSTOMER' && role !== 'ADMIN') {
//       return ["El rol debe ser uno de los valores: USER, CUSTOMER, ADMIN"];
//     }

//     return [
//       undefined,
//       new RegisterUserDto(
//         name,
//         username,
//         lastname,
//         email,
//         password,
//         city,
//         province,
//         age,
//         role as RoleType
//       ),
//     ];
//   }
// }

export class RegisterUserDto {
  constructor(
    public name: string,
    public username: string,
    public lastname: string,
    public email: string,
    public password: string,
    public city: string,
    public province: string,
    public age: number,
    public role: string,
  ) {}

  static create(object: { [key: string]: any }): [string?, RegisterUserDto?] {
    const result = registerUserSchema.safeParse(object);

    if (!result.success) {
      return [result.error.errors[0].message];
    }

    return [
      undefined,
      new RegisterUserDto(
        result.data.name,
        result.data.username,
        result.data.lastname,
        result.data.email,
        result.data.password,
        result.data.city,
        result.data.province,
        result.data.age,
        result.data.role,
      ),
    ];
  }
}
