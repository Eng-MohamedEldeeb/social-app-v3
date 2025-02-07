export const validateField = (regex) => {
  return (v) => {
    return regex.test(v);
  };
};
export const roles = {
  admin: "admin",
  user: "user",
};
export const otpTypes = {
  greeting: "greeting",
  confirmation: "confirmation",
  resetPassword: "resetPassword",
};

export const defaultValues = {
  profilePicture: {
    secure_url:
      "https://res.cloudinary.com/djjqzi02l/image/upload/v1738584341/default_profile_pic_h0mteb.png",
    public_id: "v1738584341/default_profile_pic_h0mteb",
  },
};
