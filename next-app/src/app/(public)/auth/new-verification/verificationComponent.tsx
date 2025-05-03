"use client";

import { newVerificationTokenAction } from "@/actions/verificationToken.action";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Undo2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { CircleLoader } from "react-spinners";

interface VerificationComponentProps {
  token: string;
}

export default function VerificationComponent({
  token,
}: VerificationComponentProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [success, setSucces] = useState<string>("");

  const onsubmit = useCallback(() => {
    if (!token) {
      setError("Token manquant!");
      setLoading(false);
      return;
    }
    newVerificationTokenAction(token)
      .then((data) => {
        if (data.success) setSucces(data.success);
        if (data.error) setError(data.error);
      })
      .catch((error) => {
        if (error instanceof Error) setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

  useEffect(() => {
    onsubmit();
  }, [onsubmit]);

  return (
    <div className="h-full w-full flex justify-center items-center">
      <Card className="shadow-2xl">
        <CardHeader>
          <h1 className="text-5xl font-semibold">🔐 Authentification</h1>
        </CardHeader>
        <CardContent className="flex flex-col justify-center items-center gap-4">
          <p className="text-lg">Comfirmation de votre email</p>
          {loading && <CircleLoader className="my-4" size={60} />}
          {error && <p className="text-destructive">{error}</p>}
          {success && <p className="text-green-600">{success}</p>}
        </CardContent>
        <CardFooter className="flex justify-center items-center">
          <Button asChild variant={"link"}>
            <Link href={"/auth/connexion"}>
              <Undo2 size={20} className="mr-2" />
              Retour à la connexion
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
