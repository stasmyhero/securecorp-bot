export const validatePhone = (phoneNumber) => /^((\+7|7|8)+([0-9]){10})$/.test(phoneNumber);

export const validateEmail = (email) => email.includes('@') && email[0] !== '@';
