import PageTitle from "@/components/page-title";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Metadata } from "next";
import StudentInfosForm from "./components/student-infos-form";
import StudentPreferencesForm from "./components/student-preferences-form";
import StudentSecurityForm from "./components/student-security-form";
import StudentProfileManager from "./components/student-profile-manager";

export const metadata: Metadata = {
  title: "Mon profil",
};

export default function StudentProfile() {
  return (
    <>
      <PageTitle title="Mon profil" />
      <StudentProfileManager /> 
    </>
  );
}
