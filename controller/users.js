const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { generateFromEmail } = require('unique-username-generator');
const otpGenerator = require('otp-generator');
const createError = require('../utility/error');
const Prisma = require('../prisma/index');
// const { sendVerificationEmail } = require('../utility/otp-email');
const { sentOtp } = require('../utility/otp');

const signupHandler = async (req, res, next) => {
    try {
        const existingUser = await Prisma.user.findFirst({
            where: {
                OR: [{ email: req.body.email }, { username: generateFromEmail(req.body.email, 3) }],
            },
        });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email or username already exists',
            });
        }
        const hashedPwd = await bcrypt.hash(req.body.password, 10);
        const username = await generateFromEmail(req.body.email, 3);
        const otpExpirationTime = new Date(Date.now() + 15 * 60 * 1000);

        const user = await Prisma.user.create({
            data: {
                name: req.body.name,
                phone: `+88${req.body.phone_number}`,
                email: req.body.email,
                password: hashedPwd,
                role: req.body.role,
                username,
                otpExpirationTime,
            },
        });

        res.status(200).json({
            success: true,
            message: 'User added successfully',
            data: user,
        });
    } catch (error) {
        console.log(error);
        next(createError(500, 'Something went wrong!'));
    }
};

const signInHandler = async (req, res, next) => {
    try {
        const existingUser = await Prisma.user.findFirst({
            where: {
                OR: [{ email: req.body.email }, { username: generateFromEmail(req.body.email, 3) }],
            },
        });
        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: 'User not exists',
            });
        }
        // Verify the password
        const passwordMatch = await bcrypt.compare(req.body.password, existingUser.password);
        if (!passwordMatch) {
            return res.status(401).json({ status: false, message: 'Incorrect password' });
        }
        const generateOtp = otpGenerator.generate(6, {
            digits: true,
            upperCase: false,
            specialChars: false,
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
        });
        const otpExpirationTime = new Date(Date.now() + 15 * 60 * 1000);

        const updateOtp = await Prisma.user.update({
            where: {
                email: req.body.email,
            },
            data: {
                otp: generateOtp,
                otpExpirationTime,
            },
        });
        // sendVerificationEmail(req.body.email, generateOtp);
        const status = await sentOtp(existingUser?.phone, generateOtp);
        if (status !== 'SENT') {
            return res.status(500).json({
                success: false,
                message: "OPT can't sent successfully",
            });
        }
        if (updateOtp) {
            return res.status(200).json({
                success: true,
                message: 'Otp sent successfully',
                data: {
                    email: req.body.email,
                },
            });
        }
    } catch (error) {
        next(createError(500, 'Something went wrong!'));
    }
};
const userVerify = async (req, res, next) => {
    try {
        const { email, otp } = req.body;

        // Fetch user record by email
        const user = await Prisma.user.findFirst({
            where: {
                email,
            },
        });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'User not found',
            });
        }

        // Check if OTP matches and has not expired
        const currentTimestamp = new Date();
        if (user.otp !== otp || user.otpExpirationTime < currentTimestamp) {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP or OTP has expired',
            });
        }
        // Generate JWT and check if OTP is correct
        const { id, name, email: userEmail, username, role } = user;
        if (user.otp === otp && user.otpExpirationTime >= currentTimestamp) {
            const token = jwt.sign(
                {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: '1d',
                }
            );
            res.status(200).json({
                success: true,
                message: 'Authentication Successful',
                access_token: token,
                user: {
                    id,
                    name,
                    email: userEmail,
                    username,
                    role,
                },
            });
        }
    } catch (error) {
        next(createError(500, 'Something went wrong!'));
    }
};
// get all users
const getAllUsers = async (req, res, next) => {
    try {
        const users = await Prisma.user.findMany();

        res.status(200).json({
            success: true,
            message: 'Users fetched successfully',
            data: users,
        });
    } catch (error) {
        next(createError(500, 'Something went wrong!'));
    }
};
// get a single user
const getUserById = async (req, res, next) => {
    try {
        const user = await Prisma.user.findUnique({
            where: {
                id: req.params.id,
            },
            include: { blog: true, notices: true },
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }
        res.status(200).json({
            success: true,
            message: 'User fetched successfully',
            data: user,
        });
    } catch (error) {
        console.log(error);
        next(createError(500, 'Something went wrong!'));
    }
};
// user update
const updateUser = async (req, res, next) => {
    try {
        console.log(req.body);
        const existingUser = await Prisma.user.findUnique({
            where: {
                id: req.params.id,
            },
        });
        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }
        const hashedPwd = await bcrypt.hash(req.body.password, 10);
        const user = await Prisma.user.update({
            where: {
                id: req.params.id,
            },
            data: {
                name: req.body.name,
                email: req.body.email,
                password: hashedPwd,
                role: req.body.role,
            },
        });
        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            data: user,
        });
    } catch (error) {
        // console.log(error.message);
        next(createError(500, 'Something went wrong!'));
    }
};
// delete user
const deleteUser = async (req, res, next) => {
    try {
        const existingUser = await Prisma.user.findUnique({
            where: {
                id: req.params.id,
            },
        });
        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }
        await Prisma.user.delete({
            where: {
                id: req.params.id,
            },
        });
        res.status(200).json({
            success: true,
            message: 'User deleted successfully',
        });
    } catch (error) {
        next(createError(500, 'Something went wrong!'));
    }
};
module.exports = {
    signupHandler,
    signInHandler,
    userVerify,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
};
