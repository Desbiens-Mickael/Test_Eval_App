import { Metadata } from "next";
import VerificationComponent from "./verificationComponent";

export const metadata: Metadata = {
  title: "Comfirmation de l'email",
};

export default async function NewVerificationPage({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  const token = searchParams.token;
  return <VerificationComponent token={token} />;
}
