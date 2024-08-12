import Image from "next/image";
import Link from "next/link";
import LogoSmall from "@/public/logo/logo-small.png";
import LogoNormal from "@/public/logo/logo.png";

const Logo = () => {
  return (
    <div>
      <Link href={"/"} className="md:hidden">
        <Image
          src={LogoSmall}
          alt="logo"
          width={50}
          height={50}
          className="p-1"
        />
      </Link>
      <Link href={"/"} className="hidden md:block">
        <Image src={LogoNormal} alt="logo" width={100} height={100} />
      </Link>
    </div>
  );
};

export default Logo;
