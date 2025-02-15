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

export const changePassword = ({ email = "", otp = "" } = {}) => {
  return {
    from: `"Social Media App" <${process.env.EMAIL}>`,
    to: email,
    subject: "Change Password Email",
    text: `To Change Your Account's Password Use The Code ${otp}`,
  };
};

export const deleteAccount = ({ email = "", otp = "" } = {}) => {
  return {
    from: `"Social Media App" <${process.env.EMAIL}>`,
    to: email,
    subject: "Warning E-mail",
    text: `Your account is Proccesing To Be Deleted, If You are The Request User use ${otp} confirm Deleting Your Account, if not We Suggest You To Change Your Password For Your Own Privacy`,
  };
};
