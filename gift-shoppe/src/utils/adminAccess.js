export function getAdminEmails() {
  const raw = process.env.REACT_APP_ADMIN_EMAILS || '';
  return raw
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminUser(user) {
  if (!user?.email) return false;
  const admins = getAdminEmails();
  if (admins.length === 0) return false;
  return admins.includes(user.email.toLowerCase());
}
