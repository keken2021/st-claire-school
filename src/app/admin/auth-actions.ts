
"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/auth";

export type LoginState = { error: string } | null;

/**
 * Credentials sign-in. The error message is deliberately identical for an
 * unknown email and a wrong password, so the form reveals nothing about which
 * accounts exist.
 */
export async function signInWithCredentials(
  _previous: LoginState,
  formData: FormData
): Promise<LoginState> {
  try {
    const email = formData.get("email");
    const password = formData.get("password");

    console.log("Email:", JSON.stringify(email));
    console.log(
      "Password received:",
      typeof password === "string",
      "Length:",
      typeof password === "string" ? password.length : 0
    );

    await signIn("credentials", {
      email,
      password,
      redirectTo: "/admin",
    });

    return null;
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Those details did not match an account." };
    }
    // signIn throws a redirect on success; rethrow so Next can handle it.
    throw error;
  }
}
