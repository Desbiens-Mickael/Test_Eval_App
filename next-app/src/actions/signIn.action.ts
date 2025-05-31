"use server";

import { signIn } from "auth";

const signInAction = async (provider: string, redirectTo?: string) => {
  await signIn(provider, { redirectTo });
};

export default signInAction;
