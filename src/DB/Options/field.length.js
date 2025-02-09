export const userNameLength = {
  min: 2,
  max: 16,
};

export const passwordLength = {
  min: 8,
  max: 16,
};

export const otpLength = {
  max: 4,
};

export const bioLength = {
  max: 570,
};

export const titleLength = {
  max: 50,
};

export const contentLength = {
  max: 500,
};

export const groubNameLength = {
  min: 4,
  max: 16,
};

export const groupInfoLength = {
  max: 1750,
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
