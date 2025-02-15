import cloud from "./Config/cloud.config.js";
import { defaultValues } from "../../../DB/Options/field.validation.js";

export const cloudUploader = async ({
  req,
  userId,
  folderType,
  replaceWith,
}) => {
  try {
    // Checking the Img Public_id
    // case 1- if true ? create a new folder
    // case 2 - if false ? don't create a new folder
    const checkPicID = replaceWith == defaultValues.avatar.public_id;

    // Img Path in File System
    const { path } = req.file;

    // Img Destination Path on Cloudinary
    const folder = `${process.env.APP_NAME}/users/${userId}/${folderType}`;

    // Uploading Img
    return await cloud.uploader.upload(path, {
      // checkPicID are needed with { folder } in case of updating or uploading,
      // if there was no replaceWith ? checkPicID if it equals the default value,
      //  if true ? create a folder, if false ? don't create a new folder
      //  if true ? create a folder, if false ? don't create a new folder
      // if there was a replaceWith ? checkPicID if it equals the default value,
      //  if true ? create a folder, if false ? don't create a new folder
      //  if true ? create a folder, if false ? don't create a new folder

      // replaceWith && checkPicID are needed with { folder } in case of updating or uploading
      // Auth
      // case 1- if the user uploaded a profile picture
      // ((!replaceWith || checkPicID) && { folder }), => return { folder }
      // ((!undeified = true || false ) && { folder }) will create a new Folder for new profile Picture

      // (replaceWith && !checkPicID && { public_id: replaceWith }), => won't Return { public_id }
      // (undeified X && !checkPicID && { public_id: replaceWith }), will not continue replace anything because there was no old profile picture

      // case 2- if the user didn't upload a profile picture
      // Folder creation:
      // ((!replaceWith || checkPicID) && { folder }), => return { folder }
      // ((!undeified = true || true ) && { folder }) will create a new Folder for new profile Picture

      // Replacing picutre:
      // (replaceWith && !checkPicID && { public_id: replaceWith }), => won't Return { public_id }
      // (undeified X && !checkPicID && { public_id: replaceWith }), will not continue replace anything because there was no old profile picture

      // Update Profile
      // case 1- there was already an old profile picture
      // Folder creation:
      // ((!replaceWith || checkPicID) && { folder }), => won't return { folder }
      // ((!true = false || false X ) && { folder }), will not create a new folder if there was already an old profile picture => won't return { folder }

      // Replacing picutre:
      // (replaceWith && !checkPicID && { public_id: replaceWith }), => Return { public_id }
      // (true && !false = true && { public_id: replaceWith }), will replace the old uploaded profile picture

      // case 2 - there was no profile pictures
      // Folder creation:
      // ((!replaceWith || checkPicID) && { folder }), => return { folder }
      // ((!true = false || true ) && { folder }), will create a new folder if there was no profile picture

      // Replacing picutre:
      // (replaceWith && !checkPicID && { public_id: replaceWith }), => won't return { public_id }
      // (true && !true = fasle X && { public_id: replaceWith }), will not replace anything because there was no profile picture

      ...((!replaceWith || checkPicID) && { folder }),
      ...(replaceWith && !checkPicID && { public_id: replaceWith }),
    });
  } catch (error) {
    console.log(error);
  }
};
