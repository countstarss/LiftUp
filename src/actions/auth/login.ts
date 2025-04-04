"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import AuthError from "next-auth";

import { signIn } from "@/utils/auth";
import { LoginSchema } from "@/schemas";
import { getUserByEmail } from "@/lib/auth/user";

// MARK: Login
export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  // 检查用户是否存在，并确保 password 字段存在
  if (!existingUser || !existingUser.password) {
    return { error: "Invalid email or password!" };
  }

  // MARK: Validation
  const isPasswordValid = await bcrypt.compare(password, existingUser.password);
  console.log("Input Password:", password);
  console.log("Stored Hashed Password:", existingUser.password);
  console.log("Password Valid:", isPasswordValid);
  if (!isPasswordValid) {
    return { error: "Invalid email or password!" };
  }

  // MARK: Login
  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false, // 禁止自动重定向
    });
    console.log("SignIn Result:", result);

    if (result?.ok) {
      console.log("Login successful!");
      // 强制刷新会话
      window.location.reload(); // 页面刷新解决导航栏信息不更新
      window.location.href = "/"; // 手动跳转到目标页面
    } else {
      console.error("Login failed:", result?.error);
    }
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Invalid credentials!" };
    }
    throw error;
  }
};
