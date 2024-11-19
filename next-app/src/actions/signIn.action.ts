"use server";

import { signIn } from "auth";

const signInAction = async (provider: string) => {
  await signIn(provider);
};

export default signInAction;
