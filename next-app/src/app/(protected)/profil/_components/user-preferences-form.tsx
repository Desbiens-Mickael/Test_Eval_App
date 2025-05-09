"use client";

import AvatarUpload from "@/components/user/avatar-upload";
import { useUpdateUserAvatar } from "@/hooks/mutations/use-update-user-avatar";

type UserPreferencesFormProps = {
  imgPath: string | null;
};

export function UserPreferencesForm({ imgPath }: UserPreferencesFormProps) {
  const { isPending, mutate } = useUpdateUserAvatar();
  return (
    <div>
      <h2 className="text-2xl font-semibold text-center mb-4">
        Mes préférences
      </h2>
      <AvatarUpload
        handleUpload={mutate}
        isPending={isPending}
        image={imgPath ?? ""}
      />
    </div>
  );
}
