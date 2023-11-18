const Prisma = require('../prisma/index');
const { uploadNoticeFile } = require('../upload/notice_upload');
const createError = require('../utility/error');

// add notice
const uploadNotice = async (req, res, next) => {
    try {
        const uploadFile = req.file;
        const fileUrl = await uploadNoticeFile(uploadFile);
        const upload = await Prisma.notice.create({
            data: {
                title: req.body.title,
                file: fileUrl,
                type: req.body.type,
                publishBy: req.body.publishBy,
            },
        });
        res.status(200).json({
            success: true,
            message: 'Notice Upload successfully',
            data: upload,
        });
    } catch (error) {
        console.log(error.message);
        next(createError(500, 'Something went wrong!'));
    }
};
// get all notice
const getNotice = async (req, res, next) => {
    try {
        const notices = await Prisma.notice.findMany({
            include: { user: { select: { name: true } } },
            orderBy: { publish_date: 'desc' },
        });
        res.status(200).json({
            success: true,
            message: 'Notice fetched successfully',
            data: notices,
        });
    } catch (error) {
        next(createError(500, 'Something went wrong!'));
    }
};
// delete notice
const deleteNotice = async (req, res, next) => {
    try {
        const notice = await Prisma.notice.delete({
            where: {
                id: req.params.id,
            },
        });
        res.status(200).json({
            success: true,
            message: 'Notice deleted successfully',
            data: notice,
        });
    } catch (error) {
        next(createError(500, 'Something went wrong!'));
    }
};
module.exports = { uploadNotice, getNotice, deleteNotice };
