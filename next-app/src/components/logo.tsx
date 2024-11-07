import Image from "next/image";

interface LogoProps {
  width: number;
  height: number;
  className?: string;
  type?: "mobile" | "horizontal" | "vertical";
}

const logoType = {
  mobile: "/assets/images/logo-mobile.png",
  horizontal: "/assets/images/logo-horizontal.png",
  vertical: "/assets/images/logo-vertical.png",
};

export default function Logo({ width, height, className, type = "mobile" }: LogoProps) {
  return <Image src={logoType[type]} alt="logo" width={width} height={height} className={className} />;
}
