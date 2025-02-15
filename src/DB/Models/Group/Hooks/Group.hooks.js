import cloud from "../../../../Utils/Upload/Cloudinary/Config/cloud.config.js";
import * as fieldValidation from "../../../Options/field.validation.js";

import Post from "../../Post/Post.model.js";

export const post_findOneAndDelete = async function (doc, next) {
  const { _id, cover } = doc;
  const groupData = { onGroup: _id };
  console.log(this.getFilter());

  if (cover.public_id != fieldValidation.defaultValues.profilePicture.public_id)
    await cloud.uploader.destroy(cover.public_id);

  await Promise.allSettled([Post.deleteMany(groupData)]);
};
