const Prisma = require('../prisma/index');
const createError = require('../utility/error');
const { uploadFile } = require('../upload/members_image');
// add members
const addMembers = async (req, res, next) => {
    try {
        // console.log(req.body);
        const uploadedFile = req.file;
        // Access the uploaded file data
        const base64Image = uploadedFile.buffer.toString('base64');
        const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!allowedMimeTypes.includes(uploadedFile.mimetype)) {
            next(createError(400, 'Only .jpg, .jpeg, and .png formats are allowed'));
        }
        const dataUri = `data:${uploadedFile.mimetype};base64,${base64Image}`;
        const imageUrl = await uploadFile(dataUri, req.body.name);
        const memberData = await Prisma.members.create({
            data: {
                name: req.body.name,
                image: imageUrl,
                gender: req.body.gender,
                blood_group: req.body.blood_group,
                father_or_husband: req.body.father_or_husband,
                designation: req.body.designation,
                permanent_address: req.body.permanent_address,
                present_address: req.body.present_address,
                phone: `+88${req.body.phone}`,
                email: req.body.email,
                degree: req.body.degree,
                priority: req.body.priority,
            },
        });
        res.status(200).json({
            success: true,
            message: 'Member added successfully',
            data: memberData,
        });
    } catch (error) {
        console.log(error.message);
        next(createError(500, 'Something went wrong!'));
    }
};
// get all members
const getAllMembers = async (req, res, next) => {
    try {
        const members = await Prisma.members.findMany({
            orderBy: {
                priority: 'asc',
            },
        });
        res.status(200).json({
            success: true,
            message: 'Members fetched successfully',
            data: members,
        });
    } catch (error) {
        console.error(error);
        next(createError(500, 'Something went wrong!'));
    }
};

// update member
const updateMember = async (req, res, next) => {
    try {
        const uploadedFile = req.file;
        if (uploadedFile) {
            // Fix the typo here
            // Access the uploaded file data
            const base64Image = uploadedFile.buffer.toString('base64');
            const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];
            if (!allowedMimeTypes.includes(uploadedFile.mimetype)) {
                next(createError(400, 'Only .jpg, .jpeg, and .png formats are allowed'));
            }
            const dataUri = `data:${uploadedFile.mimetype};base64,${base64Image}`;
            const imageUrl = await uploadFile(dataUri, req.body.name);
            req.body.image = imageUrl;
        }
        if (req.body.phone) {
            req.body.phone = `+88${req.body.phone}`;
        }
        const memberData = await Prisma.members.update({
            where: {
                id: req.params.id,
            },
            data: {
                name: req.body.name,
                image: req.body.image,
                gender: req.body.gender,
                blood_group: req.body.blood_group,
                father_or_housing: req.body.father_or_housing,
                designation: req.body.designation,
                permanent_address: req.body.permanent_address,
                present_address: req.body.present_address,
                phone: req.body.phone,
                email: req.body.email,
                degree: req.body.degree,
            },
        });
        res.status(200).json({
            success: true,
            message: 'Member updated successfully',
            data: memberData,
        });
    } catch (error) {
        console.error(error);
        next(createError(500, 'Something went wrong!'));
    }
};
// delete member
const deleteMember = async (req, res, next) => {
    try {
        console.log(req.params.id);
        const memberData = await Prisma.members.delete({
            where: {
                id: req.params.id,
            },
        });
        res.status(200).json({
            success: true,
            message: 'Member deleted successfully',
            data: memberData,
        });
    } catch (error) {
        console.error(error);
        next(createError(500, 'Something went wrong!'));
    }
};
// search member
const searchMember = async (req, res, next) => {
    try {
        const { query } = req.query; // Get the search query from the query parameters.
        console.log(query);
        // Use Prisma to search for members based on the query.
        const members = await Prisma.members.findMany({
            where: {
                OR: [
                    { name: { contains: query } },
                    { email: { contains: query } },
                    { phone: { contains: query } },
                ],
            },
        });

        if (members.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No members found for the given query.',
                data: [],
            });
        }

        res.status(200).json({
            success: true,
            message: 'Members searched successfully',
            data: members,
        });
    } catch (error) {
        console.error(error);
        next(createError(500, 'Something went wrong!'));
    }
};
// get members by id
const getMemberById = async (req, res, next) => {
    try {
        const member = await Prisma.members.findUnique({
            where: {
                id: req.params.id,
            },
        });
        res.status(200).json({
            success: true,
            message: 'Member fetched successfully',
            data: member,
        });
    } catch (error) {
        console.error(error);
        next(createError(500, 'Something went wrong!'));
    }
};
module.exports = {
    addMembers,
    getAllMembers,
    updateMember,
    deleteMember,
    searchMember,
    getMemberById,
};
