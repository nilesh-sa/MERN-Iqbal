import path from 'path';
import multer from 'multer';
import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
// Type aliases
type MulterFileType = Express.Multer.File;
type MulterCallBackType = multer.FileFilterCallback;

// ✨ Reusable function to create a multer instance dynamically
const createMulterUpload = (allowedMimeTypes: string[]) => {
   const uploadDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  // Disk storage setup
  const storage = multer.diskStorage({
    destination: function (req: Request, file: MulterFileType, cb) {
      cb(null, path.join(process.cwd(), 'uploads'));
    },
    filename: function (req: Request, file: MulterFileType, cb) {
      const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, uniquePrefix + '-' + file.originalname);
    }
  });

  // File type filter
 // File type filter
const fileFilter = function (req: Request, file: MulterFileType, cb: MulterCallBackType) {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Invalid file type: ${file.mimetype}. Only allowed: ${allowedMimeTypes.join(', ')}`
      )
    );
  }
};


  // Return multer instance
  return multer({
    storage,
    limits: {
      fileSize: 1024 * 1024 * 10,
    },
    fileFilter
  });
};

// ✅ Single file upload middleware with dynamic types
export const uploadSingle = (fileKey: string, allowedTypes: string[]) => {
  const upload = createMulterUpload(allowedTypes).single(fileKey);

  return function (req: Request, res: Response, next: NextFunction) {
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: err.message });
      } else if (err) {
        return res.status(500).json({ error: err.message });
      }
      next();
    });
  };
};

// ✅ Multiple file upload middleware with dynamic types
export const uploadMultiple = (fileKey: string, allowedTypes: string[]) => {
  const upload = createMulterUpload(allowedTypes).array(fileKey, 10); // max 10 files

  return function (req: Request, res: Response, next: NextFunction) {
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: err.message });
      } else if (err) {
        return res.status(500).json({ error: err.message });
      }
      next();
    });
  };
};
