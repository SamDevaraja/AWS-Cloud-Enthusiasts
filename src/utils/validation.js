const RAJALAKSHMI_EMAIL_RE = /^\S+@rajalakshmi\.edu\.in$/i;

const isRajalakshmiEmail = (email) => {
  return typeof email === 'string' && RAJALAKSHMI_EMAIL_RE.test(email.trim());
};

module.exports = {
  isRajalakshmiEmail,
};
