export const PHONE_VALIDATION_ERROR_MESSAGE = 
  "Phone number must start with +7 and be exactly 12 characters long (e.g., +71234567890).";

export const validatePhoneNumber = (phoneNumber: string): boolean => {
  const isCorrectStarts = phoneNumber.startsWith('+7');
  const isCorrectLength = phoneNumber.length === 12;

  if (!isCorrectStarts) {
    return false;
  }

  if (!isCorrectLength) {
    return false;
  }

  return true;
};