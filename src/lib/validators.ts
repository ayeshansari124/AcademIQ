export function required(value: any, field: string) {
  if (!value) {
    throw new Error(`${field} is required`);
  }
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isStrongPassword(password: string) {
  return password.length >= 6;
}
