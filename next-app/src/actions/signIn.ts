"use server";

import { signIn } from "auth";

const signInProvider = async (provider: string) => {
  await signIn(provider);
};

export default signInProvider;
