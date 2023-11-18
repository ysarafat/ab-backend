const jwt = require('jsonwebtoken');
const createError = require('../utility/error');
const Prisma = require('../prisma');

const moderatorVerify = async (req, res, next) => {
    try {
        const { authorization } = req.headers;
        const token = authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await Prisma.user.findFirst({
            where: {
                email: decoded.email,
            },
        });
        console.log('user', user);
        if (user.role !== 'moderator' && user.role !== 'admin' && user.role !== 'superAdmin') {
            next(createError(403, 'Requested resource is forbidden'));
        }
        req.id = decoded.id;
        req.email = decoded.email;
        req.role = decoded.role;
        next();
    } catch (error) {
        next(createError(403, 'Requested resource is forbidden'));
    }
};
module.exports = moderatorVerify;
