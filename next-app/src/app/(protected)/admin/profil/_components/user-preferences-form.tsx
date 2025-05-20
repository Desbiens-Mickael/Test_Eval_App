"use client";

import { motion } from "framer-motion";
import { Image as ImageIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AvatarUpload from "@/components/user/avatar-upload";
import { useUpdateUserAvatar } from "@/hooks/mutations/use-update-user-avatar";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

type UserPreferencesFormProps = {
  imgPath: string | null;
};

export function UserPreferencesForm({ imgPath }: UserPreferencesFormProps) {
  const { isPending, mutate } = useUpdateUserAvatar();

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="space-y-6"
    >
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">Photo de profil</CardTitle>
          </div>
          <CardDescription className="text-sm">
            Téléchargez une nouvelle photo pour personnaliser votre profil
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-4">
            <AvatarUpload
              handleUpload={mutate}
              isPending={isPending}
              image={imgPath ?? ""}
            />
            <p className="text-xs text-muted-foreground text-center">
              Formats acceptés : JPG, PNG, WEBP (max. 5MB)
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
