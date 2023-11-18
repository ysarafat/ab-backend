const express = require('express');
const {
    publishBlog,
    getAllBlog,
    blogByAuthor,
    blogById,
    blogDelete,
} = require('../controller/blogs');
const { upload } = require('../upload/file_upload');

const router = express.Router();
router.post('/publish', upload.single('image'), publishBlog);
router.get('/all', getAllBlog);
router.get('/author/:authorId', blogByAuthor);
router.get('/:id', blogById);
router.delete('/delete/:id', blogDelete);
module.exports = router;
