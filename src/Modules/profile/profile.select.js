// Get User's Own Profile:
export const getProfile = {
  projection: {
    profilePicture: {
      public_id: 0,
    },
    password: 0,
    passwords: 0,
  },
  populate: {
    path: "posts",
    select: {
      attachment: {
        public_id: 0,
      },
    },
    options: {
      sort: {
        createdAt: -1,
      },
    },
  },
};

// Get User's Own Profile Followers:
export const getProfileFollowers = {
  projection: {
    followers: 1,
  },
};

// Get User's Own Profile Following:
export const getProfileFollowing = {
  projection: {
    following: 1,
  },
};

// Update User's Own Profile:
export const updateProfile = {
  projection: {
    _id: 1,
    profilePicture: 1,
    email: 1,
    isDeactivated: 1,
  },
};

// Confirm E-mail:
export const confirmNewEmail = {
  projection: {
    _id: 1,
    tempEmail: 1,
    isDeactivated: 1,
  },
};

// Toggle Private Profile:
export const togglePrivateProfile = {
  projection: {
    _id: 1,
    privateProfile: 1,
    isDeactivated: 1,
  },
};

// Request Delete User's Own Profile:
export const deleteProfile = {
  projection: {
    _id: 1,
    email: 1,
    password: 1,
  },
};
// Delete User's Own Profile:
export const confirmDeleteProfile = {
  projection: {
    _id: 1,
  },
};

// Change Password:
export const changePassword = {
  projection: {
    _id: 1,
    email: 1,
  },
};

// Delete User's Own Profile:
export const confirmNewPassword = {
  projection: {
    _id: 1,
    password: 1,
    passwords: 1,
  },
};
