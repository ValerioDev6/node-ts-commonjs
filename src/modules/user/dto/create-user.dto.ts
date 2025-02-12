import { z } from "zod";

export const registerUserSchema = z.object({
  name: z.string({
    required_error: "El nombre es requerido",
  }),
  username: z.string({
    required_error: "El nombre de usuario es requerido",
  }),
  lastname: z.string({
    required_error: "El apellido es requerido",
  }),
  email: z
    .string({
      required_error: "El email es requerido",
    })
    .email("El formato del email no es válido"),
  password: z.string({
    required_error: "La contraseña es requerida",
  }),
  city: z.string({
    required_error: "La ciudad es requerida",
  }),
  province: z.string({
    required_error: "La provincia es requerida",
  }),
  age: z
    .number({
      required_error: "La edad es requerida",
    })
    .min(0, "La edad debe ser un número positivo"),
  role: z.enum(["USER", "CUSTOMER", "ADMIN"] as const, {
    required_error: "El rol es requerido",
    invalid_type_error: "El rol debe ser uno de los valores: USER, CUSTOMER, ADMIN",
  }),
});
