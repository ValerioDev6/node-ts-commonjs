import multer from "multer";
import path from "path";
import { Uuid } from "./uuid.adpater";

const VALID_FILE_TYPES = ["image/png", "image/jpg", "image/jpeg", "image/gif"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const storage = multer.diskStorage({
  destination: "assets",
  filename: (req, file, cb) => {
    cb(null, Uuid.v4() + path.extname(file.originalname));
  },
});

const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (VALID_FILE_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
    const err = new Error("Solo se permiten archivos de imagen (.png, .jpg, .jpeg, .gif)");
    err.name = "ExtensionError";
    return cb(err);
  }
};

export default multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
});
