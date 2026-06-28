import { getAdminEmails, isAdminUser } from './adminAccess';

describe('adminAccess', () => {
  const originalEnv = process.env.REACT_APP_ADMIN_EMAILS;

  afterEach(() => {
    process.env.REACT_APP_ADMIN_EMAILS = originalEnv;
  });

  it('parses admin emails from env', () => {
    process.env.REACT_APP_ADMIN_EMAILS = ' Admin@Example.com , ops@test.com ';
    expect(getAdminEmails()).toEqual(['admin@example.com', 'ops@test.com']);
  });

  it('returns false when user is not in allowlist', () => {
    process.env.REACT_APP_ADMIN_EMAILS = 'admin@example.com';
    expect(isAdminUser({ email: 'guest@example.com' })).toBe(false);
    expect(isAdminUser(null)).toBe(false);
  });

  it('returns true for allowlisted admin email', () => {
    process.env.REACT_APP_ADMIN_EMAILS = 'admin@example.com';
    expect(isAdminUser({ email: 'Admin@Example.com' })).toBe(true);
  });
});
