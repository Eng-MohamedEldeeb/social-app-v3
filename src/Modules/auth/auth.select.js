// Confirm E-mail Selection :
export const confirmEmail = {
  projection: {
    _id: 1,
  },
};

// Register Selection :
export const register = {
  projection: {
    _id: 1,
  },
};

// login Selection :
export const login = {
  projection: {
    userName: 1,
    password: 1,
  },
};

// Reset-Password Selection :
export const resetPassword = {
  projection: {
    password: 1,
    passwords: 1,
  },
};
