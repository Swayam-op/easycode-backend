import multer from "multer";
import { ApiError } from "./ApiError.js";
import { STATUS } from "./StatusCode.js";
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log("inside destination funciton")
        cb(null,path.join(__dirname,'../','../' ,'/public/Uploads'));
    },
    filename: function (req, file, cb) {
        console.log("inside filename funciton")
        console.log("filename", file.originalname)
        cb(null, file.originalname);
    }
});

// Define the file filter function to check file extension and size
const fileFilter = (req, file, cb) => {
    // Check file extension
    const allowedExtensions = ['.jpeg', '.jpg', '.png'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
        req.errorMessage = "Only JPEG, JPG, and PNG files are allowed";
    }

    // Check file size (maximum 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
        req.errorMessage = "File size exceeds the limit of 5MB";
    }

    // Pass the file if it passes all checks
    cb(null, true);
};

export const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});