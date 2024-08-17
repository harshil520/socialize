const cloudinary = require("cloudinary").v2;

const uploadToCloudinary = (file) => {
    return new Promise((resolve, reject) => {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        });

        cloudinary.uploader.upload(file.path, { folder: "socialize" }, (err, result) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                resolve(result.secure_url);
            }
        });
    });
};

module.exports = { uploadToCloudinary };