// Super Admin Utilities
// For development: set NEXT_PUBLIC_SUPER_ADMIN_EMAIL in your environment variables

export const isSuperAdmin = (): boolean => {
  // Check if user has super admin privileges
  // This can be expanded later with proper authentication
  const superAdminEmail = process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL
  
  // For now, return true if super admin email is set
  // In a real app, you'd check against the current user's email
  return !!superAdminEmail
}

export const requireSuperAdmin = (action: string): void => {
  if (!isSuperAdmin()) {
    throw new Error(`${action} requires super admin privileges`)
  }
}