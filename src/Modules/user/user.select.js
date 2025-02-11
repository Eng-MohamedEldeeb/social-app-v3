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

// Follow User:
export const followUser = {
  projection: {
    _id: 1,
    following: 1,
    isDeactivated: 1,
  },
};

// UnFollow User:
export const unfollowUser = {
  projection: {
    _id: 1,
    following: 1,
    isDeactivated: 1,
  },
};

// block user:
export const blockUser = {
  projection: {
    _id: 1,
    blockList: 1,
    isDeactivated: 1,
  },
};

// Un-block user:
export const unblockUser = {
  projection: {
    _id: 1,
    blockList: 1,
    isDeactivated: 1,
  },
};
