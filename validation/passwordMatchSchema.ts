import { z } from "zod";
import { passwordSchema } from "./passwordSchema";

export const passworMatchdSchema = z
  .object({
    password: passwordSchema,
    passwordConfirm: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.passwordConfirm) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["passwordConfirm"],
        message: "Password don't match",
      });
    }
  }); 

//data refer to the values password and passwordconfirm
//ctx or context wich will allow us to add custom validation
