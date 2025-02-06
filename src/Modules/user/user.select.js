export const getProfile = {
  projection: {
    profilePicture: {
      secure_url: 1,
    },
    userName: 1,
    posts: 1,
    followers: 1,
    following: 1,
    blockList: 1,
  },
};

export const getProfileFollowers = {
  projection: {
    followers: 1,
  },
};

export const getProfileFollowing = {
  projection: {
    following: 1,
  },
};

export const updateProfile = {
  projection: {
    _id: 1,
    profilePicture: 1,
  },
};
