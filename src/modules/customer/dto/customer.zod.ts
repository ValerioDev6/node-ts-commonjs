import { z } from "zod";

export const registerCustomerSchema = z.object({
  address: z.string({
    required_error: "Address is requerid",
  }),

  dni: z.number({
    required_error: "DNI es requerido",
  }),

  user: z.string({
    required_error: "Es requerido el usuario",
  }),
});
