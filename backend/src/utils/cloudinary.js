import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv"

dotenv.config()

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath, folder = "uploads") => {
  try {
    if (!localFilePath) return null;

    // console.log("Uploading to Cloudinary:", localFilePath);
    
    const result = await cloudinary.uploader.upload(localFilePath, {
      folder,                    // optional folder
      resource_type: "auto",     // image, video, pdf, etc.
    }); 

    // console.log("Cloudinary upload success:", result);

    // Cleanup local file
    fs.unlinkSync(localFilePath);

      return {
      public_id: result.public_id,
      url: result.secure_url,
    };

  } catch (error) {
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath); // ensure cleanup
    }
    console.error("Cloudinary upload failed:", error);
    return null;
  }
};

export { uploadOnCloudinary };
