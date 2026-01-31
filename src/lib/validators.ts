/* =========================
   BASIC REQUIRED
   ========================= */
export function required(value: any, field: string) {
  if (
    value === undefined ||
    value === null ||
    (typeof value === "string" && value.trim() === "")
  ) {
    throw new Error(`${field} is required`);
  }
}

/* =========================
   EMAIL
   ========================= */
export function isValidEmail(email: string) {
  required(email, "Email");

  const EMAIL_REGEX =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!EMAIL_REGEX.test(email)) {
    throw new Error("Invalid email address");
  }
}

/* =========================
   PASSWORD
   ========================= */
export function isStrongPassword(password: string) {
  required(password, "Password");

  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters long");
  }

  if (!/[A-Z]/.test(password)) {
    throw new Error("Password must contain at least one uppercase letter");
  }

  if (!/[a-z]/.test(password)) {
    throw new Error("Password must contain at least one lowercase letter");
  }

  if (!/[0-9]/.test(password)) {
    throw new Error("Password must contain at least one number");
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    throw new Error("Password must contain at least one special character");
  }
}

/* =========================
   PHONE NUMBER (INDIA-SAFE)
   ========================= */
export function isValidPhone(phone: string) {
  required(phone, "Phone number");

  // Accepts:
  // 9876543210
  // +919876543210
  const PHONE_REGEX = /^(?:\+91)?[6-9]\d{9}$/;

  if (!PHONE_REGEX.test(phone)) {
    throw new Error("Invalid phone number");
  }
}

/* =========================
   NAME (HUMAN NAME)
   ========================= */
export function isValidName(name: string, field = "Name") {
  required(name, field);

  if (!/^[a-zA-Z ]+$/.test(name)) {
    throw new Error(`${field} can only contain letters`);
  }

  if (name.trim().length < 2) {
    throw new Error(`${field} must be at least 2 characters long`);
  }
}
