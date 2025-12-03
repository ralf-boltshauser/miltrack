"use server";

import { UserType } from "@/generated/prisma/enums";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export async function signUpWithUserType(
  email: string,
  password: string,
  name: string,
  userType: UserType
) {
  try {
    // Sign up the user
    const result = await auth.api.signUpEmail({
      headers: await headers(),
      body: {
        email,
        password,
        name,
      },
    });

    if ("error" in result && result.error) {
      return {
        error:
          (result.error as { message: string }).message || "Failed to sign up",
      };
    }

    // Update the user with the userType
    if (
      "data" in result &&
      typeof result.data === "object" &&
      result.data &&
      "user" in result.data &&
      result.data.user &&
      typeof result.data.user === "object" &&
      result.data.user &&
      "id" in result.data.user &&
      result.data.user.id
    ) {
      await prisma.user.update({
        where: { id: result.data.user.id as string },
        data: { userType },
      });
    }

    return {
      success: true,
      user:
        "data" in result &&
        typeof result.data === "object" &&
        result.data &&
        "user" in result.data &&
        result.data.user
          ? result.data.user
          : undefined,
    };
  } catch (error) {
    console.error("Sign up error:", error);
    return { error: "An unexpected error occurred" };
  }
}
