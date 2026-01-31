export function toTitleCase(value: string): string {
  return value
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map(word => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

export function toSentenceCase(value: string): string {
  if (!value) return "";

  let result = value.trim().toLowerCase();

  // Capitalize first character
  result = result.charAt(0).toUpperCase() + result.slice(1);

  // Capitalize letter after full stop
  result = result.replace(/\.\\s*([a-z])/g, (_, char) => {
    return ". " + char.toUpperCase();
  });

  return result;
}
