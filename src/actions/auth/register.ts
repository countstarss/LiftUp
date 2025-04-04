"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { RegisterSchema } from "@/schemas";
import { getUserByEmail } from "@/lib/auth/user";
import { notificationExamples } from "@/utils/notification";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  // MARK: Validation
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const { email, password, username } = validatedFields.data;

  // 检查邮箱是否已存在
  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: "Email already in use!" };
  }

  // 加密密码
  const hashedPassword = await bcrypt.hash(password, 10);

  // MARK: Create User
  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
      isEmailVerified: false, // 默认设置为未验证
      role: "USER",
    },
  });

  // 发送欢迎通知
  await notificationExamples.welcome(user.id);

  return { success: "Account created successfully!" };
};
