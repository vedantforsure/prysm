import Link from "next/link";
import PrimaryButton from "./PrimaryButton";
import SecondaryButton from "./SecondaryButton";

export default function Navbar() {
  return (
    <nav className="fixed top-4 left-4 right-4 z-50 flex justify-center pointer-events-none">
      <div className="w-full max-w-[1440px] flex items-center justify-end pointer-events-auto">
        <div className="hidden sm:flex items-center gap-[8px]">
          <Link href="/ai-experiments"><SecondaryButton>AI experiments</SecondaryButton></Link>
          <a href="https://www.linkedin.com/in/vedant-lad-ba322b206/" target="_blank" rel="noopener noreferrer"><SecondaryButton>LinkedIn</SecondaryButton></a>
          <a href="https://x.com/Vedantdzn" target="_blank" rel="noopener noreferrer"><SecondaryButton>X</SecondaryButton></a>
        </div>
        <div className="sm:ml-[20px]">
          <a href="https://cal.com/vedant-lad-uv3rmx/15min" target="_blank" rel="noopener noreferrer">
            <PrimaryButton>Get in touch</PrimaryButton>
          </a>
        </div>
      </div>
    </nav>
  );
}
