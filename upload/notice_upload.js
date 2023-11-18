/* eslint-disable-next-line prettier/prettier */
const { google } = require('googleapis');
const multer = require('multer');
const path = require('path');
const { PassThrough } = require('stream');

const KEYFILEPATH = path.join(__dirname, '../drive-cred.json');
const SCOPES = ['https://www.googleapis.com/auth/drive'];

const auth = new google.auth.GoogleAuth({
    keyFile: KEYFILEPATH,
    scopes: SCOPES,
});
const uploadNoticeFile = async (fileObject) => {
    const bufferStream = new PassThrough();
    bufferStream.end(fileObject.buffer);
    const drive = google.drive({ version: 'v3', auth });

    const { data } = await drive.files.create({
        media: {
            mimeType: fileObject.mimeType,
            body: bufferStream,
        },
        requestBody: {
            name: fileObject.originalname,
            parents: ['1mfYIKYYJqjl80kY_Zr-i00JNnOnQwdht'],
        },
        fields: 'id,name,webViewLink',
    });
    const fileUrl = `https://drive.google.com/uc?export=download&id=${data.id}`;
    return fileUrl;
};

const noticeUpload = multer({
    limits: { fileSize: 10000000 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only .pdf files are allowed!'));
        }
    },
});

module.exports = { noticeUpload, uploadNoticeFile };
