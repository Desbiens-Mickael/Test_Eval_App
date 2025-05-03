import PageTitle from "@/components/page-title";
import { Metadata } from "next";
import UserPRofileManager from "./_components/user-profile-manager";

export const metadata: Metadata = {
  title: "Profil",
};

export default function ProfilePage() {
  return (
    <>
      <PageTitle title="Mon profil" />
      <UserPRofileManager />
    </>
  );
}
