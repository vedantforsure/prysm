import PrimaryButton from "./PrimaryButton";
import SecondaryButton from "./SecondaryButton";

export default function Navbar() {
  return (
    <nav className="fixed top-5 left-5 right-5 z-50 flex justify-center pointer-events-none">
      <div className="w-full max-w-[1440px] flex items-center justify-end pointer-events-auto">
      <div className="hidden sm:flex items-center gap-[8px]">
        <SecondaryButton>AI experiments</SecondaryButton>
        <SecondaryButton>LinkedIn</SecondaryButton>
        <SecondaryButton>X</SecondaryButton>
      </div>
      <div className="sm:ml-[20px]">
        <PrimaryButton>Get in touch</PrimaryButton>
      </div>
      </div>
    </nav>
  );
}
