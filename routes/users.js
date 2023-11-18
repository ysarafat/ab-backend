const express = require('express');
const {
    signupHandler,
    signInHandler,
    userVerify,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
} = require('../controller/users');
const superAdminVerify = require('../middleware/superAdminVerify');

const router = express.Router();
// user router
router.post('/register', superAdminVerify, signupHandler);
router.post('/login', signInHandler);
router.post('/verify', userVerify);
router.get('/all', superAdminVerify, getAllUsers);
router.get('/:id', superAdminVerify, getUserById);
router.patch('/:id', superAdminVerify, updateUser);
router.delete('/:id', superAdminVerify, deleteUser);
module.exports = router;
