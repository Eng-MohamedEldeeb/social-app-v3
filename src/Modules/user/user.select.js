// Get Other User Profile:
export const getUserProfile = {
  projection: {
    isAuthenticated: { _id: 1, blockList: 1 },
    userAuthentication: {
      email: 0,
      phone: 0,
      password: 0,
      passwords: 0,
      avatar: {
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
export const userFollowing = {
  isAuthenticated: {
    select: {
      _id: 1,
      following: 1,
      isDeactivated: 1,
      blockList: 1,
      following: 1,
    },
  },
  userAuthentication: {
    select: {
      password: 0,
      passwords: 0,
    },
  },
};

// UnFollow User:
export const unuserFollowing = {
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

// Join Group:
export const groupJoin = {
  projection: {
    _id: 1,
    groups: 1,
  },
};

// Request Delete User's Own Profile:
export const requestDeleteAccount = {
  select: {
    _id: 1,
    email: 1,
    password: 1,
  },
};

// Delete User's Own Profile:
export const confirmDeleteAccount = {
  select: {
    _id: 1,
  },
};
// Deactivate Account:
export const deactivateAccount = {
  select: {
    _id: 1,
  },
};
