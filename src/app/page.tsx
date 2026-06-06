import Hero from "./components/Hero";
import ImageDB from "./components/ImageDB";
import RevealSection from "./components/RevealSection";
import SecondaryButton from "./components/SecondaryButton";

export default function Home() {
  return (
    <main id="top" className="flex flex-1 flex-col gap-10 sm:gap-15 bg-white">
      <Hero />
      <RevealSection className="w-full px-5 pt-10 pb-10 sm:pt-20 sm:pb-20">
        <div className="mx-auto flex max-w-content flex-col gap-12">
          <ImageDB />
        </div>
      </RevealSection>
      <RevealSection className="w-full px-5 pt-10 pb-20 sm:pt-30 sm:pb-[180px]">
        <div className="mx-auto flex max-w-content flex-col items-center gap-6">
          <div className="flex flex-row flex-wrap items-center justify-center gap-3">
            <a href="#top"><SecondaryButton className="!h-[54px] sm:!h-[66px] !px-5 sm:!px-6 !text-[19px] sm:!text-[24px]">Go to top</SecondaryButton></a>
          </div>
          <p className="text-[16px] text-ds-neutral-500">Made with ❤️ by Vedant</p>
        </div>
      </RevealSection>
    </main>
  );
}
