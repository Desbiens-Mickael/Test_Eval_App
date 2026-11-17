import { cn } from "@/lib/utils";
import Image from "next/image";

interface LogoProps {
  width: number;
  height: number;
  className?: string;
  type?: "mobile" | "horizontal" | "vertical";
}

const ICON = "/assets/images/logo-mobile.png";

/**
 * Logo EduCraft : l'icône, et pour les versions horizontale et verticale le
 * nom écrit en texte. Le nom n'est plus dans l'image (texte noir, invisible en
 * mode sombre) : il prend la couleur du thème.
 */
export default function Logo({
  width,
  height,
  className,
  type = "mobile",
}: LogoProps) {
  if (type === "mobile") {
    return (
      <Image
        src={ICON}
        alt="logo EduCraft"
        width={width}
        height={height}
        className={cn("w-auto h-auto", className)}
        priority={true}
      />
    );
  }

  const vertical = type === "vertical";
  // L'icône occupe la hauteur (horizontal) ou les deux tiers (vertical)
  const iconSize = vertical ? Math.round(height * 0.66) : height;

  return (
    <span
      className={cn(
        "inline-flex items-center",
        vertical ? "flex-col gap-1" : "gap-2",
        className
      )}
    >
      <Image
        src={ICON}
        alt=""
        aria-hidden="true"
        width={iconSize}
        height={iconSize}
        style={{ width: iconSize, height: iconSize }}
        className="shrink-0"
        priority={true}
      />
      <span
        className={cn(
          "font-bold tracking-tight text-foreground",
          vertical ? "text-2xl" : "text-xl lg:text-2xl"
        )}
      >
        EduCraft
      </span>
    </span>
  );
}
