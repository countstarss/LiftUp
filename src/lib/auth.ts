import { auth } from "@/utils/auth";
import { Role } from "@prisma/client";

export const currentUser = async () => {
  const session = await auth();
  return session?.user;
};

export const currentRole = async () => {
  const session = await auth();
  return session?.user?.role as Role;
};

export const isAdmin = async () => {
  const role = await currentRole();
  return role === Role.ADMIN;
}; 
