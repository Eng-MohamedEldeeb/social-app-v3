import Group from "../../../DB/Models/Group/Group.model.js";
import { asnycHandler } from "../../../Utils/Errors/asyncHandler.js";
import { generateMessage } from "../../../Utils/Messages/messages.generator.js";
import { errorResponse } from "../../../Utils/Res/error.response.js";
import { successResponse } from "../../../Utils/Res/success.response.js";

export const getGroup = asnycHandler(async (req, res, next) => {
  // Group Id:
  const { id } = req.params;

  //? If a Specific Group Id Exists:
  if (id) {
    const data = await Group.findById(
      id,
      {
        cover: { public_id: 0 },
      },
      {
        populate: [
          {
            path: "creator",
            select: { userName: 1 },
          },
          {
            path: "admins",
            select: { userName: 1 },
          },
          {
            path: "members",
            select: { userName: 1 },
          },
          {
            path: "posts",
          },
        ],
        lean: true,
      }
    );
    return data
      ? successResponse(
          { res },
          {
            msg: "done",
            status: 200,
            data: {
              ...data,
              membersCount: data.members.length,
            },
          }
        )
      : errorResponse(
          { next },
          {
            error: generateMessage("Group").errors.notFound.error,
            status: 404,
          }
        );
  }

  // If No Specific Group Needed:
  const data = await Group.find(
    {},
    {
      cover: { public_id: 0 },
    },
    {
      sort: { createdAt: -1 },
      populate: [
        {
          path: "creator",
          select: { userName: 1 },
        },
        {
          path: "admins",
          select: { userName: 1 },
        },
        {
          path: "posts",
        },
      ],
      lean: true,
    }
  );

  return successResponse(
    { res },
    {
      msg: "done",
      status: 200,
      data: data.length == 0 ? "No Groups Yet" : data,
    }
  );
});
