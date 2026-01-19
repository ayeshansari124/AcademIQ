export default function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3 className="mb-4 text-s font-bold uppercase tracking-wider text-blue-800">
        {title}
      </h3>
      {children}
    </section>
  );
}