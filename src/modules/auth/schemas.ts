import z from "zod";

export const registerSchema = z.object({
  email: z.email(),
  password: z.string().min(4),
  username: z
    .string()
    .min(3, "Username must be atleast 3 characters long")
    .max(50, "Username must be less than 50 characters")
    .regex(
      /^[a-z0-9][a-z0-9-]*[a-z0-9]$/,
      "Username can only contain lowercase letters, numbers and hyphens. It must start and end with a letter or number.",
    )
    .refine(
      (val) => !val.includes("--"),
      "Username must not contain any consecutive hyphens",
    )
    .transform((val) => val.toLowerCase()),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(4),
});
