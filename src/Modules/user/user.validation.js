import joi from "joi";
import { generalFields } from "../../Utils/Validation/validators/general.fields.js";
import { fileTypes } from "../../Utils/Upload/Cloudinary/Config/uploading.options.js";

export const updateProfile = joi
  .object()
  .keys({
    bio: generalFields.bio,
    userName: generalFields.userName,
    phone: generalFields.phone,
    file: joi.object().keys({
      ...generalFields.file,
      mimetype: generalFields.fileType.mimetype.valid(...fileTypes.img),
    }),
  })
  .required();
