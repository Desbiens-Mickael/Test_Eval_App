import { Metadata } from "next";
import KindFormatPage, { kindPageTitle } from "../(components)/kind-format-page";

export const metadata: Metadata = {
  title: kindPageTitle("PRACTICE", "vrai-ou-faux"),
};

export default function PracticeFormatPage() {
  return <KindFormatPage kind="PRACTICE" format="vrai-ou-faux" />;
}
