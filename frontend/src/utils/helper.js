export const isValidName = (name) => {
  if (!name || typeof name !== "string") return false;

  // Trim spaces
  name = name.trim();

  // Only letters and spaces allowed
  const validNameRegex = /^[A-Za-z\s]+$/;
  return validNameRegex.test(name);
};
