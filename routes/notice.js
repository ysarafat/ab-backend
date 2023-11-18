const express = require('express');
const { uploadNotice, getNotice, deleteNotice } = require('../controller/notices');
const { noticeUpload } = require('../upload/notice_upload');
const adminVerify = require('../middleware/adminVerify');

const router = express.Router();
// user router
router.post('/upload', adminVerify, noticeUpload.single('noticeFile'), uploadNotice);
router.get('/', getNotice);
router.delete('/delete/:id', adminVerify, deleteNotice);
module.exports = router;
