"use server";

import * as z from "zod";

import { ResetSchema } from "@/schemas";
import { getUserByEmail } from "@/lib/auth/user";
import { generatePasswordResetToken } from "@/lib/auth/token";

// MARK: 重置密码
export const reset = async (values: z.infer<typeof ResetSchema>) => {
  const validateFields = ResetSchema.safeParse(values);

  if (!validateFields.success) {
    return { error: "Invalid email!" };
  }

  const { email } = validateFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return { error: "Email not found!" };
  }

  const passwordResetToken = await generatePasswordResetToken(email);

  return { success: "Reset email sent!" };
};
