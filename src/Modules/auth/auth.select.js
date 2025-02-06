export const confirmEmail = {
  projection: {
    _id: 1,
  },
};

export const register = {
  projection: {
    _id: 1,
  },
};

export const login = {
  projection: {
    userName: 1,
    password: 1,
  },
};

export const resetPassword = {
  projection: {
    password: 1,
    passwords: 1,
  },
};
