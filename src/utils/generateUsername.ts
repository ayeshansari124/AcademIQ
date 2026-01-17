export function generateUsername(
  fullName: string,
  className?: string
) {
  const base = fullName
    .toLowerCase()
    .replace(/[^a-z]/g, "")
    .slice(0, 6);

  const suffix = Math.floor(1000 + Math.random() * 9000);

  const classPart = className
    ? className.toLowerCase().replace(/\s/g, "")
    : "";

  return `${base}${classPart}_${suffix}`;
}
