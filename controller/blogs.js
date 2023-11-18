const Prisma = require('../prisma');
const { uploadFileToCloud } = require('../upload/file_upload');
const createError = require('../utility/error');

// publish blog
const publishBlog = async (req, res, next) => {
    try {
        const { title, content, category, tags, author } = req.body;
        const parseTags = JSON.parse(tags);
        const uploadedFile = req.file;

        // Access the uploaded file data
        const base64Image = uploadedFile.buffer.toString('base64');
        const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!allowedMimeTypes.includes(uploadedFile.mimetype)) {
            next(createError(400, 'Only .jpg, .jpeg, and .png formats are allowed'));
        }
        const dataUri = `data:${uploadedFile.mimetype};base64,${base64Image}`;
        const imageUrl = await uploadFileToCloud(dataUri, title);
        console.log(imageUrl);
        const blogData = await Prisma.blog.create({
            data: {
                title,
                image: imageUrl,
                content,
                category,
                tags: parseTags,
                author,
            },
        });
        res.status(200).json({
            success: true,
            message: 'Blog publish successfully ',
            data: blogData,
        });
    } catch (error) {
        next(createError(500, 'Something went wrong!'));
    }
};
// get all blog
const getAllBlog = async (req, res, next) => {
    try {
        const blogs = await Prisma.blog.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                publish_at: 'asc',
            },
        });
        res.status(200).json({
            success: true,
            message: 'Blogs fetched successfully',
            data: blogs || [],
        });
    } catch (error) {
        next(createError(500, 'Something went wrong!'));
    }
};
// find blog by author
const blogByAuthor = async (req, res, next) => {
    try {
        const { authorId } = req.params;
        const blogs = await Prisma.blog.findMany({
            where: { author: authorId },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
        res.status(200).json({
            success: true,
            message: 'Blogs fetched successfully',
            data: blogs || [],
        });
    } catch (error) {
        console.log(error);
        next(createError(500, 'Something went wrong!'));
    }
};
// find blog by id
const blogById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const blog = await Prisma.blog.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
        res.status(200).json({
            success: true,
            message: blog ? 'Blog fetched successfully' : 'No data found',
            data: blog || {},
        });
    } catch (error) {
        console.log(error);
        next(createError(500, 'Something went wrong!'));
    }
};
// blog delete
const blogDelete = async (req, res, next) => {
    try {
        const { id } = req.params;
        const blog = await Prisma.blog.delete({
            where: { id },
        });
        res.status(200).json({
            success: true,
            message: 'Blog delete successfully',
            data: blog || {},
        });
    } catch (error) {
        console.log(error);
        next(createError(500, 'Something went wrong!'));
    }
};
module.exports = { publishBlog, getAllBlog, blogByAuthor, blogById, blogDelete };
