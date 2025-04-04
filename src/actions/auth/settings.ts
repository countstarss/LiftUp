"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { update } from "@/utils/auth";
import prisma from "@/lib/prisma";
import { SettingsSchema } from "@/schemas";
import { getUserById } from "@/lib/auth/user";
import { currentUser } from "@/lib/auth";

// MARK: Settings
export const settings = async (values: z.infer<typeof SettingsSchema>) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const dbUser = await getUserById(user.id as string);

  if (!dbUser) {
    return { error: "Unauthorized" };
  }

  if (user.isOAuth) {
    values.email = undefined;
    values.password = undefined;
    values.newPassword = undefined;
    values.isTwoFactorEnabled = undefined;
  }

  // if (values.email && values.email !== user.email) {
  //   const existingUser = await getUserByEmail(values.email);

  //   if (existingUser && existingUser.id !== user.id) {
  //     return { error: "Email already in use!" };
  //   }

  //   const verificationToken = await generateVerificationToken(values.email);
  //   await sendVerificationEmail(
  //     verificationToken.identifier,
  //     verificationToken.token
  //   );

  //   return { success: "Verification email sent!" };
  // }

  if (values.password && values.newPassword && dbUser.password) {
    const passwordsMatch = await bcrypt.compare(
      values.password,
      dbUser.password
    );

    if (!passwordsMatch) {
      return { error: "Incorrect password!" };
    }

    const hashedPassword = await bcrypt.hash(values.newPassword, 10);
    values.password = hashedPassword;
    values.newPassword = undefined;

    // MARK: 发送密码更改通知
    // NOTE: 触发预定义的消息类型
    // await notificationExamples.passwordChanged(dbUser.id);
  }

  const updatedUser = await prisma.user.update({
    where: { id: dbUser.id },
    data: {
      ...values,
    },
  });

  update({
    user: {
      name: updatedUser.username,
      email: updatedUser.email,
      isTwoFactorEnabled: updatedUser.isTwoFactorEnabled,
      role: updatedUser.role,
    },
  });

  return { success: "Settings Updated!" };
};
