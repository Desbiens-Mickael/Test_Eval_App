import { Metadata } from "next";
import KindFormatPage, { kindPageTitle } from "../(components)/kind-format-page";

export const metadata: Metadata = {
  title: kindPageTitle("PRACTICE", "carte"),
};

export default function PracticeFormatPage() {
  return <KindFormatPage kind="PRACTICE" format="carte" />;
}
