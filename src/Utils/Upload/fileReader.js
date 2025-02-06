import multer from "multer";

export const fileReader = ({ fileType = [] }) => {
  const storage = multer.diskStorage({});

  const fileFilter = (req, file, cb) => {
    if (!fileType.includes(file.mimetype))
      return cb(new Error("Unknwon File Type", { cause: 400 }), false);
    return cb(null, true);
  };

  return multer({ dest: "uploads", fileFilter, storage });
};
