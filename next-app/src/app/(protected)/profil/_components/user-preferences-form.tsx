"use client";

import AvatarUpload from "@/components/user/avatar-upload";

type UserPreferencesFormProps = {
  imgPath: string | null;
};

export function UserPreferencesForm({ imgPath }: UserPreferencesFormProps) {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-center mb-4">Mes préférences</h2>
      <AvatarUpload image={imgPath ?? ""} />
    </div>
  );
}
