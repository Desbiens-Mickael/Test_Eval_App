import { Metadata } from "next";
import KindFormatPage, { kindPageTitle } from "../(components)/kind-format-page";

export const metadata: Metadata = {
  title: kindPageTitle("PRACTICE", "choix-multiple"),
};

export default function PracticeFormatPage() {
  return <KindFormatPage kind="PRACTICE" format="choix-multiple" />;
}
