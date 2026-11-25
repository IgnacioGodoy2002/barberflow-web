type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  accent?: "blue" | "purple" | "yellow" | "green";
};

const ACCENTS = {
  blue: "text-blue-400",
  purple: "text-purple-400",
  yellow: "text-yellow-400",
  green: "text-green-400",
};

export function SectionHeading({ eyebrow, title, description, accent = "blue" }: SectionHeadingProps) {
  return (
    <div data-reveal className="mb-10 text-center">
      <p className={`text-sm font-semibold uppercase tracking-[0.3em] ${ACCENTS[accent]}`}>{eyebrow}</p>

      <h2 className="mt-3 text-3xl font-black text-white md:text-4xl">{title}</h2>

      {description && (
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-zinc-400">{description}</p>
      )}
    </div>
  );
}
