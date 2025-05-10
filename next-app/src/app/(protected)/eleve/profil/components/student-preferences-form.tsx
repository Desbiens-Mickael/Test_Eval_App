"use client";

import AvatarUpload from "@/components/user/avatar-upload";
import { useUpdateStudentAvatar } from "@/hooks/mutations/student/use-update-student-avatar";

type StudentPreferencesFormProps = {
  imgPath: string | null;
};

export default function StudentPreferencesForm({
  imgPath,
}: StudentPreferencesFormProps) {
  const { isPending, mutate } = useUpdateStudentAvatar();
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
