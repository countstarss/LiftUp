"use server";

import { signOut } from "@/utils/auth";

// MARK: Logout
export const logout = async () => {
  await signOut();
};
