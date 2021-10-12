export function createMockUser(
  email = "",
  isAdmin = false,
  isAuthenticated = false,
  userType = ""
  ) {
  return {
      email,
      isAdmin,
      isAuthenticated,
      userType
  };
}