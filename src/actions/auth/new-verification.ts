"use server";

import { getUserByEmail } from "@/lib/auth/user";
import { getVerificationTokenByToken } from "@/lib/auth/verification-token";
import prisma from "@/lib/prisma";

// MARK: newVerification
export const newVerification = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) {
    return { error: "Token does not exists!" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "Token expired!" };
  }

  const existingUser = await getUserByEmail(existingToken.identifier);

  if (!existingUser) {
    return { error: "Email does not exists!" };
  }

  await prisma.user.update({
    where: { id: existingUser.id },
    data: {
      isEmailVerified: true,
      email: existingToken.identifier,
    },
  });

  await prisma.verificationToken.delete({
    where: { id: existingToken.id },
  });

  return { success: "Email verified!" };
};
