"use client";
import { useCurrentRole } from "@/hooks/useCurrentRole";
import { UserRole } from "@prisma/client";

interface RoleGateProps {
  allowedRol: UserRole;
  children: React.ReactNode;
}

const RoleGate = ({ children, allowedRol }: RoleGateProps) => {
  const role = useCurrentRole();

  return (
    <div className="h-full w-full">
      {role !== allowedRol ? (
        <div className="h-full w-full flex justify-center items-center">
          <p className="text-5xl text-destructive font-bold"> {"Vous n'avez pas acces à cette section!"} </p>
        </div>
      ) : (
        <>{children}</>
      )}
    </div>
  );
};

export default RoleGate;
