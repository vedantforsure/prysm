import Hero from "./components/Hero";
import ImageDB from "./components/ImageDB";
import RevealSection from "./components/RevealSection";
import SecondaryButton from "./components/SecondaryButton";

export default function Home() {
  return (
    <main id="top" className="flex flex-1 flex-col gap-20">
      <Hero />
      <RevealSection className="w-full px-5 pt-30 pb-20">
        <ImageDB />
      </RevealSection>
      <RevealSection className="w-full px-5 pt-30 pb-[180px]">
        <div className="mx-auto flex max-w-content flex-col items-center justify-center gap-6">
          <a href="#top"><SecondaryButton className="!h-[66px] !px-6 !text-[24px]">Go to top</SecondaryButton></a>
          <p className="text-[16px] text-ds-neutral-500">Made with ❤️ by Vedant</p>
        </div>
      </RevealSection>
    </main>
  );
}
