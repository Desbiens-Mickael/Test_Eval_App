import { Metadata } from "next";
import ShowStudent from "../(components)/show-student";

export const metadata: Metadata = {
  title: "Élève",
};

export default async function Page({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const studentId = (await params).studentId;

  return <ShowStudent studentId={studentId} />;
}
