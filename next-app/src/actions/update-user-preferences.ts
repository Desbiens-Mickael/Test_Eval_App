import { userPreferencesFormSchema } from "@/schema/shema-zod";
import { z } from "zod";

const updateUserPreferences = async (preferences: z.infer<typeof userPreferencesFormSchema>) => {
  console.log(preferences);
};

export default updateUserPreferences;
