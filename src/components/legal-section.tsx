type LegalSectionProps = {
  title: string;
  children: React.ReactNode;
};

export function LegalSection({ title, children }: LegalSectionProps) {
  return (
    <section className="scroll-mt-24">
      <h2 className="border-b border-orange-100 pb-2 text-lg font-semibold tracking-tight text-stone-800">
        {title}
      </h2>
      <div className="porange-page mt-4 space-y-3 text-sm text-stone-600 sm:text-[0.9375rem]">
        {children}
      </div>
    </section>
  );
}
