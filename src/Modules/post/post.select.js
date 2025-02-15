// Edit Post Selection :
export const commentRouter = {
  isAuthenticated: {
    projection: {
      _id: 1,
    },
  },
  postAuthentication: {
    projection: {
      _id: 1,
    },
  },
};

// // Get Single Post Selection :
// export const getSinglePost = {
//   isAuthenticated: { projection: { _id: 1 } },
//   postAuthentication: {
//     populate: {
//       path: "owner",
//       select: {
//         userName: 1,
//       },
//     },
//   },
// };

// Add Post Selection :
export const addPost = {
  isAuthenticated: { projection: { _id: 1, joinedGroups: 1 } },
};

// Edit Post Selection :
export const editPost = {
  isAuthenticated: {
    projection: {
      _id: 1,
      role: 1,
    },
  },
  postAuthentication: {
    projection: {
      _id: 1,
      owner: 1,
    },
  },
};

// Archive Post Selection :
export const archivePost = {
  isAuthenticated: {
    projection: {
      _id: 1,
      role: 1,
    },
  },
  postAuthentication: {
    projection: {
      _id: 1,
      owner: 1,
      isArchived: 1,
    },
  },
};

// Restore Post Selection :
export const restorePost = {
  isAuthenticated: {
    projection: {
      _id: 1,
      role: 1,
    },
  },
  postAuthentication: {
    projection: {
      _id: 1,
      owner: 1,
      isArchived: 1,
    },
  },
};

// Delete Post Selection :
export const deletePost = {
  isAuthenticated: {
    projection: {
      _id: 1,
      role: 1,
    },
  },
  postAuthentication: {
    projection: {
      _id: 1,
      owner: 1,
      isArchived: 1,
      attachment: {
        public_id: 1,
      },
    },
  },
};

// Post Like Selection :
export const postLike = {
  isAuthenticated: {
    projection: {
      _id: 1,
    },
  },
  postAuthentication: {
    projection: {
      _id: 1,
      isArchived: 1,
      likedBy: 1,
    },
  },
};
