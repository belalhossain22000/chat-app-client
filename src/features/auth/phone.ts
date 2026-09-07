// Build the phone string we send to the API.
// If the user typed a full international/local number (starts with `+`, `00`,
// or a leading `0`), keep it as-is and don't prepend the dial code — this
// avoids creating duplicate accounts like `01940...` vs `+88001940...`.
export function composePhone(dialCode: string, input: string): string {
  const raw = input.trim();

  if (raw.startsWith("+")) return `+${raw.slice(1).replace(/\D/g, "")}`;

  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";

  // typed with a country code already (00 prefix) or a national trunk 0
  if (digits.startsWith("00")) return `+${digits.slice(2)}`;
  if (digits.startsWith("0")) return digits;

  return `${dialCode}${digits}`;
}

export function isValidPhoneInput(input: string): boolean {
  return input.replace(/\D/g, "").length >= 6;
}
