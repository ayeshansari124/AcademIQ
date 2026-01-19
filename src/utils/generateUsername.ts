export function generateUsername(fullName: string): string {
  const base = fullName
    .toLowerCase()
    .trim()
    .split(" ")[0]
    .replace(/[^a-z]/g, "");

  const randomNumber = Math.floor(10 + Math.random() * 90);

  return `${base}${randomNumber}`;
}
