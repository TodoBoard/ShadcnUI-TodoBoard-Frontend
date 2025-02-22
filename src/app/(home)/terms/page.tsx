import { TermsHero } from "@/app/modules/terms/hero";
import { TermsSection } from "@/app/modules/terms/sections/terms";

export default function TermsPage() {
  return (
    <section className="homepage-container w-full">
      <div className="max-w-screen-xl mx-auto py-10 md:py-15">
        <TermsHero />
        <TermsSection />
      </div>
    </section>
  );
}
