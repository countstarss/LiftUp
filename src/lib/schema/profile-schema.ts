// Profile Schema
import { z } from "zod";

export const ProfileSchema = z.object({
    fullName: z
        .string()
        .min(3, "Full Name must be at least 3 characters"),
    email: z
        .string()
        .email("Invalid email address"),
    profileImage: z
        .string()
        .url("Invalid image URL")
        .optional(),
    bio: z
        .string()
        .describe("bio")
        .optional(),
    website: z
        .string()
        .describe("website")
        .optional(),
    location: z
        .string()
        .describe("location")
        .optional(),
})

export type ProfileSchemaType = z.infer<typeof ProfileSchema>;