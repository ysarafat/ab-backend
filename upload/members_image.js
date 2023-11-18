/* eslint-disable operator-linebreak */
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

const upload = multer({
    limits: { fileSize: 500000 },
    fileFilter: (req, file, cb) => {
        if (
            file.mimetype === 'image/jpeg' ||
            file.mimetype === 'image/png' ||
            file.mimetype === 'image/jpg'
        ) {
            cb(null, true);
        } else {
            cb(new Error('Only .png, .jpg and .jpeg formats are allowed!'));
        }
    },
});
const uploadFile = async (dataUri, name) => {
    const cloudinaryResponse = await cloudinary.uploader.upload(dataUri, {
        folder: 'members-profile-images',
        use_filename: true,
        resource_type: 'image',
        public_id: `${name.split(' ').join('_')}_${Date.now()}`.toLowerCase(),
        transformation: [{ width: 500, height: 500, crop: 'fit' }],
        chunk_size: 1000000,
    });
    const imageUrl = cloudinaryResponse.secure_url;
    return imageUrl;
};

module.exports = { upload, uploadFile };
