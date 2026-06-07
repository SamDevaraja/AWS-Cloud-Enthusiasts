export const isRajalakshmiEmail = (email) => {
  return typeof email === 'string' && /^\S+@rajalakshmi\.edu\.in$/i.test(email.trim());
};
