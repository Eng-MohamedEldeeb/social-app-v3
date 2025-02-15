import OTP from "../../../DB/Models/OTP.model.js";
import User from "../../../DB/Models/User/User.model.js";
import { otpTypes } from "../../../DB/Options/field.validation.js";
import { asnycHandler } from "../../../Utils/Errors/asyncHandler.js";
import { generateMessage } from "../../../Utils/Messages/messages.generator.js";
import { errorResponse } from "../../../Utils/Res/error.response.js";
import { successResponse } from "../../../Utils/Res/success.response.js";
import { compareValue } from "../../../Utils/Security/hash.js";
import { cloudUploader } from "../../../Utils/Upload/Cloudinary/cloudUploader.js";
import { folderTypes } from "../../../Utils/Upload/Cloudinary/Config/uploading.options.js";

export const twoStepsVerification = asnycHandler(async (req, res, next) => {});

// -----------------------------------------------------------------------------------
