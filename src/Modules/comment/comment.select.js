// Edit Post Selection :
export const replyRouter = {
  commentAuthentication: {
    projection: {
      _id: 1,
    },
  },
};

// Get Single Comment Selection :
export const getSingleComment = {
  commentAuthentication: {
    projection: {
      attachment: {
        public_id: 0,
      },
    },
    populate: {
      path: "owner",
      select: {
        userName: 1,
      },
    },
  },
};

// Edit Comment Selection :
export const editComment = {
  isAuthenticated: {
    projection: {
      _id: 1,
      role: 1,
    },
  },
  commentAuthentication: {
    projection: {
      _id: 1,
      owner: 1,
    },
  },
};

// Delete Comment Selection :
export const deleteComment = {
  isAuthenticated: {
    projection: {
      _id: 1,
      role: 1,
    },
  },
  commentAuthentication: {
    projection: {
      _id: 1,
      owner: 1,
    },
  },
};

// Comment Like Selection :
export const commentLike = {
  isAuthenticated: {
    projection: {
      _id: 1,
    },
  },
  commentAuthentication: {
    projection: {
      _id: 1,
      likedBy: 1,
    },
  },
};
