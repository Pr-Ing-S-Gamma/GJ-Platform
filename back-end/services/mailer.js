const nodemailer = require('nodemailer');

const sendEmail = async (email, subject, text) => {
    try {

        let transporter = nodemailer.createTransport({
            host: "smtp.office365.com",
            port: '587',
            auth: {
              user: process.env.EMAIL,
              pass: process.env.EMAILPASSWORD
            },
            secureConnection: false,
            tls: { ciphers: 'SSLv3' }
          });
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: subject,
            text: text
        };

        try{
            await transporter.sendMail(mailOptions);
        }catch(error){
            console.log(error);
        }

    } catch (error) {
        console.log(error);
    }
}

module.exports = { sendEmail };