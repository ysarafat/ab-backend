/* eslint-disable prettier/prettier */
const { google } = require('googleapis');
const multer = require('multer');
const path = require('path');
const { Stream } = require('stream');
// const apiKey = require();

const KEYFILEPATH = path.join(__dirname, '../drive-cred.json');
const SCOPES = ['https://www.googleapis.com/auth/drive'];

const auth = new google.auth.GoogleAuth({
    keyFile: KEYFILEPATH,
    scopes: SCOPES,
});
const uploadFile = async (fileObject) => {
    const bufferStream = new Stream.PassThrough();
    bufferStream.end(fileObject.buffer);
    const drive = google.drive({ version: 'v3', auth });

    const { data } = await drive.files.create({
        media: {
            mimeType: fileObject.mimeType,
            body: bufferStream,
        },
        requestBody: {
            name: fileObject.originalname,
            parents: ['1kxi335sQBCDp6ZLAlFM_zU1CQ1ARgGD-'],
        },
        fields: 'id,name,webViewLink',
    });
    const fileUrl = `https://drive.google.com/uc?export=view&id=${data.id}`;
    return fileUrl;
};
const upload = multer({
    limits: { fileSize: 500000 },
    fileFilter: (req, file, cb) => {
        if (
            file.mimetype === 'image/jpeg'
            || file.mimetype === 'image/png'
            || file.mimetype === 'image/jpg'
        ) {
            cb(null, true);
        } else {
            cb(new Error('Only .png, .jpg and .jpeg formats are allowed!'));
        }
    },
});

module.exports = { upload, uploadFile };
