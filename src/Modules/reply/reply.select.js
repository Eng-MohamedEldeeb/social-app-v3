// Get Single Reply Selection :
export const getSingleReply = {
  commentAuthentication: { projection: { _id: 1 } },

  replyAuthentication: {
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

// Edit Reply Selection :
export const editReply = {
  commentAuthentication: { projection: { _id: 1 } },

  replyAuthentication: {
    projection: {
      _id: 1,
      owner: 1,
    },
  },
};

// Delete Reply Selection :
export const deleteReply = {
  commentAuthentication: { projection: { _id: 1 } },

  replyAuthentication: {
    projection: {
      _id: 1,
      owner: 1,
    },
  },
};

// Reply Like Selection :
export const replyLike = {
  commentAuthentication: { projection: { _id: 1 } },

  replyAuthentication: {
    projection: {
      _id: 1,
      likedBy: 1,
    },
  },
};
