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

// Get Other User Profile:
export const getUserProfile = {
  projection: {
    isAuthenticated: { _id: 1, blockList: 1 },
    userAuthentication: {
      email: 0,
      phone: 0,
      password: 0,
      passwords: 0,
      profilePicture: {
        public_id: 0,
      },
    },
  },
};

// Get User's Own Profile Followers:
export const getUserFollowers = {
  projection: {
    isAuthenticated: { _id: 1, blockList: 1 },
    userAuthentication: {
      followers: 1,
      blockList: 1,
      privateProfile: 1,
      isDeactivated: 1,
    },
  },
};

// Get User's Own Profile Following:
export const getUserFollowing = {
  projection: {
    isAuthenticated: { _id: 1, blockList: 1 },
    userAuthentication: {
      following: 1,
      blockList: 1,
      privateProfile: 1,
      isDeactivated: 1,
    },
  },
};

// Update User's Own Profile:
export const updateProfile = {
  projection: {
    _id: 1,
    profilePicture: 1,
    isDeactivated: 1,
  },
};

// Update User's Own Profile:
export const confirmNewEmail = {
  projection: {
    _id: 1,
    tempEmail: 1,
    isDeactivated: 1,
  },
};

// Update User's Own Profile:
export const followUser = {
  projection: {
    _id: 1,
    following: 1,
    isDeactivated: 1,
  },
};

// Update User's Own Profile:
export const unfollowUser = {
  projection: {
    _id: 1,
    following: 1,
    isDeactivated: 1,
  },
};

// Update User's Own Profile:
export const blockUser = {
  projection: {
    _id: 1,
    blockList: 1,
    isDeactivated: 1,
  },
};

// Update User's Own Profile:
export const unblockUser = {
  projection: {
    _id: 1,
    blockList: 1,
    isDeactivated: 1,
  },
};

// Update User's Own Profile:
export const togglePrivateProfile = {
  projection: {
    _id: 1,
    privateProfile: 1,
    isDeactivated: 1,
  },
};

// Update User's Own Profile:
export const deleteProfile = {
  projection: {
    _id: 1,
  },
};
