import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  timeout: 60000, //60second
});

/**
 * Upload a file to Cloudinary
 * @param {File} file - The file object to upload
 * @param {string} folder - Optional folder name in Cloudinary
 * @returns {Promise<Object>} upload result
 */

export async function uploadToCloudinary(file, folder = "user-profiles") {
  try {
    if (!file) return null;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Data = `data:${file.type};base64,${buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(base64Data, {
      folder: folder,
      resource_type: "auto",
      transformation: [
        { width: 500, height: 500, crop: "limit" },
      ],
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Failed to upload image to Cloudinary");
  }
}

/**
 * Delete (image/video)
 * @param {string} publicId 
 * @param {string} resourceType - type: "image", "video", etc.
 * @returns {Promise<Object>} deletion result
 */
export async function deleteFromCloudinary(publicId, resourceType = "image") {
  try {
    if (!publicId) return null;

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });

    return result;
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    throw new Error("Failed to delete media from Cloudinary");
  }
}
