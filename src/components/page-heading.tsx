type PageHeadingProps = {
  title: string;
  description?: string;
};

export function PageHeading({ title, description }: PageHeadingProps) {
  return (
    <header className="mb-10 sm:mb-12">
      <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
        {title}
      </h1>
      {description ? (
        <p className="mt-3 max-w-2xl text-sm text-stone-600 sm:text-base">
          {description}
        </p>
      ) : null}
    </header>
  );
}
