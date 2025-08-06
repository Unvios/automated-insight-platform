export const PHONE_VALIDATION_ERROR_MESSAGE = 
  "Номер телефона должен начинаться с +7 и быть ровно 12 символов (например, +71234567890).";

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