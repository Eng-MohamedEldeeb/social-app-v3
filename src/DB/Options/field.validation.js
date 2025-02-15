export const validateField = (regex) => {
  return (v) => {
    return regex.test(v);
  };
};

export const fieldLength = ({ fieldName = "", min = 0, max = 0 } = {}) => {
  return {
    min: {
      value: min,
      msg: `${fieldName}} Can't Be less Then ${min} Charactors`,
    },
    max: {
      value: max,
      msg: `${fieldName} Can't Be more Then ${max} Charactors`,
    },
  };
};

export const defaultValues = {
  avatar: {
    secure_url:
      "https://res.cloudinary.com/djjqzi02l/image/upload/v1738584341/default_profile_pic_h0mteb.png",
    public_id: "v1738584341/default_profile_pic_h0mteb",
  },
};
