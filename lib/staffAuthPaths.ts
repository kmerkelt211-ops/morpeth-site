export function sanitizeStaffReturnTo(input: string | null | undefined): string {
  if (!input) return "/staff";
  if (!input.startsWith("/")) return "/staff";
  if (input.startsWith("//")) return "/staff";
  return input.startsWith("/staff") ? input : "/staff";
}

export function buildStaffLoginRedirectPath(returnTo = "/staff"): string {
  return `/staff/login?returnTo=${encodeURIComponent(sanitizeStaffReturnTo(returnTo))}`;
}
