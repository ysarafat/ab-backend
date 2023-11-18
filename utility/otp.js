const { default: axios } = require('axios');

const sentOtp = async (sentTo, otp) => {
    try {
        const otpVerify = new URLSearchParams();
        otpVerify.append('token', process.env.SMS_API);
        otpVerify.append('to', `${sentTo}`);
        otpVerify.append(
            'message',
            `To complete your SASKS login, please enter the following verification code: ${otp}. This code will expire in 5 minutes. Please don't share your OTP with others.`
        );
        const response = await axios.post('http://api.greenweb.com.bd/g_api.php?json', otpVerify);
        const { status } = response.data[0];
        return status;
    } catch (error) {
        console.error('Error sending OTP:', error.message);
    }
};

module.exports = { sentOtp };
