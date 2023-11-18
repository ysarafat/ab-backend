const express = require('express');

const { upload } = require('../upload/members_image');
const {
    addMembers,
    getAllMembers,
    updateMember,
    deleteMember,
    searchMember,
    getMemberById,
} = require('../controller/members');
const adminVerify = require('../middleware/adminVerify');
const superAdminVerify = require('../middleware/superAdminVerify');

const router = express.Router();
// admission router
router.post('/', adminVerify, upload.single('image'), addMembers);
router.get('/', getAllMembers);
router.get('/search', searchMember);
router.get('/:id', getMemberById);
router.patch('/:id', superAdminVerify, upload.single('image'), updateMember);
router.delete('/:id', superAdminVerify, deleteMember);

module.exports = router;
