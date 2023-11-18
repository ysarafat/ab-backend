const express = require('express');
const { admission } = require('../controller/admission');
const { upload } = require('../utility/student-image-upload');

const router = express.Router();
// admission router
router.post('/', upload.single('image'), admission);
router.get('/', (req, res) => {
    res.send('Hello World!');
});
module.exports = router;
