"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";

import { NewPasswordSchema } from "@/schemas";
import { getPasswordResetTokenByToken } from "@/lib/auth/password-reset-token";
import { getUserByEmail } from "@/lib/auth/user";
import prisma from "@/lib/prisma";

export const newPassword = async (
  values: z.infer<typeof NewPasswordSchema>,
  token: string | null
) => {
  if (!token) {
    return { error: "Missing token!" };
  }

  const validateFields = NewPasswordSchema.safeParse(values);

  if (!validateFields.success) {
    return { error: "Invalid fields!" };
  }

  const { password } = validateFields.data;

  const existingToken = await getPasswordResetTokenByToken(token);

  if (!existingToken || new Date(existingToken.expires) < new Date()) {
    return { error: "Invalid or expired token" };
  }

  const user = await getUserByEmail(existingToken.email);

  if (!user) {
    return { error: "User not found" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  });

  await prisma.passwordResetToken.delete({
    where: { id: existingToken.id },
  });

  return { success: "Password updated!" };
};
