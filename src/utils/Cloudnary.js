import {v2 as cloudinary} from 'cloudinary';




export function setUpCloudinary(){
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUDNAME,
        api_key: process.env.CLOUDINARY_APIKEY,
        api_secret: process.env.CLOUDINARY_SECRETKEY
      });
}


export default cloudinary;