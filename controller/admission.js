const { default: ShortUniqueId } = require('short-unique-id');
const Prisma = require('../prisma/index');
const { uploadFile } = require('../utility/student-image-upload');
const createError = require('../utility/error');

const admission = async (req, res, next) => {
    try {
        const {
            name,
            dob,
            gender,
            religion,
            phone_number,
            email,
            blood_group,
            ssc_roll,
            ssc_reg,
            ssc_passing_year,
            ssc_gpa,
            ssc_department,
            school,
            hsc_roll,
            hsc_reg,
            hsc_session,
            hsc_gpa,
            hsc_department,
            collage,
            father_name,
            mother_name,
            guardian_name,
            guardian_phone_number,
            permanent_address,
            present_address,
            goal,
            payment_number,
            transaction_id,
        } = req.body;
        const uploadedFile = req.file;
        const image = await uploadFile(uploadedFile);
        const { randomUUID } = new ShortUniqueId({ length: 10 });
        const admission_id = randomUUID().toUpperCase();
        const admissionData = await Prisma.admission.create({
            data: {
                admission_id,
                image,
                name,
                dob,
                gender,
                religion,
                phone_number,
                email,
                blood_group,
                ssc_roll,
                ssc_reg,
                ssc_passing_year,
                ssc_gpa,
                ssc_department,
                school,
                hsc_roll,
                hsc_reg,
                hsc_session,
                hsc_gpa,
                hsc_department,
                collage,
                father_name,
                mother_name,
                guardian_name,
                guardian_phone_number,
                permanent_address,
                present_address,
                goal,
                payment_number,
                transaction_id,
            },
        });
        res.status(200).json({
            success: true,
            message: 'Your admission application has been successfully submitted',
            data: admissionData,
        });
    } catch (error) {
        next(createError(500, 'Something went wrong'));
    }
};
module.exports = { admission };
