const express = require('express');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;
const morgan = require('morgan');

const app = express();
require('dotenv').config();

const PORT = process.env.PORT || 5000;
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
app.use(
    cors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use('/admission', require('./routes/admission'));
app.use('/members', require('./routes/members'));
app.use('/user', require('./routes/users'));
app.use('/notice', require('./routes/notice'));
app.use('/blog', require('./routes/blogs'));

app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// DEFAULT ERROR HANDLING
app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || 'Something went wrong!';
    return res.status(status).json({
        success: false,
        status,
        message,
    });
});
