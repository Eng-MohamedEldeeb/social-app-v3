export const greetingEmail = ({ email = "", userName = "" } = {}) => {
  return {
    from: `"Social Media App" <${process.env.EMAIL}>`,
    to: email,
    subject: "Greetings !",
    text: `Welcome to our app ${userName}`,
  };
};

export const confirmEmail = ({ email = "", otp = "" } = {}) => {
  return {
    from: `"Social Media App" <${process.env.EMAIL}>`,
    to: email,
    subject: "Confirm Email",
    text: `To Verify Your Account Use The Code ${otp}`,
  };
};

export const verifyEmail = ({ email = "", otp = "" } = {}) => {
  return {
    from: `"Social Media App" <${process.env.EMAIL}>`,
    to: email,
    subject: "Verify Email",
    text: `To Verify Your Account's Password Use The Code ${otp}`,
  };
};
export const resetPassword = ({ email = "", otp = "" } = {}) => {
  return {
    from: `"Social Media App" <${process.env.EMAIL}>`,
    to: email,
    subject: "Reset Password Email",
    text: `To Reset Your Account's Password Use The Code ${otp}`,
  };
};
