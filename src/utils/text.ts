// Converts input to sentence case in real-time while typing
export function toSentenceCaseLive(value: string): string {
  if (!value) return value;

  let result = value;

  // Capitalize first letter of the text
  result = result.replace(/^\s*[a-z]/, (c) => c.toUpperCase());

  // Capitalize letter after . ! ?
  result = result.replace(/([.!?]\s+)([a-z])/g, (_, p1, p2) => {
    return p1 + p2.toUpperCase();
  });

  return result;
}
