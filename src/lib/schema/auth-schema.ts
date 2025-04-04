
import { z } from "zod";
// MARK: LoginForm
export const LoginForm = z.object({
  email: z.string().describe("email").email({
    message:"Invalid Email"
  }),
  password: z.string().describe("password").min(8, {
    message: "Paswrod is required.",
  }),
})

// MARK: SignUpForm
export const SignUpForm = z.object({
    first_name:z
    .string()
    .describe("first_name")
    .min(1,{
      message: "first name is requied.",
    }),
    last_name:z
    .string()
    .describe("")
    .min(1,{
      message: "last name is requied",
    }),
    email: z
    .string()
    .describe('Email')
    .email({
      message: 'Invalid Email',
    }),
    password: z
      .string()
      .describe('Password')
      .min(6, 'Password must be minimum 6 characters'),
    confirmPassword: z
      .string()
      .describe('Confirm Password')
      .min(6, 'Password must be minimum 6 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

// NOTE: 需要创建填写表单的在这里进行zod初步验证

export interface UserDetails {
  id: string
  first_name: string
  last_name: string
  full_name?: string
  avatar_url?: string
}

//MARK: EditUserProfileSchema
export const EditUserProfileSchema = z.object({
  email: z.string().email('Required'),
  name: z.string().min(1, 'Required'),
})