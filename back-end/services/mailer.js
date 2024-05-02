const nodemailer = require('nodemailer');
const fs = require('fs');

function get(obj, desc) {
    var arr = desc.split(".");
    while (arr.length && (obj = obj[arr.shift()]));
    return obj;
}

function replaceTokens(HTML, replacements) {
    return HTML.split('{{').map(function (i) {
        var symbol = i.substring(0, i.indexOf('}}')).trim();
        return i.replace(symbol + '}}', get(replacements, symbol));
    }).join('');
}

const sendEmail = async (email, subject, message, link) => {
    try {
        let transporter = nodemailer.createTransport({
            host: "smtp.office365.com",
            port: 587,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAILPASSWORD
            },
            secureConnection: false,
            tls: { ciphers: 'SSLv3' }
        });

        const htmlTemplate = await fs.promises.readFile('services/email_template.html', 'utf-8');

        const htmlContent = replaceTokens(htmlTemplate, { subject, message, link });

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: subject,
            html: htmlContent
        };

        await transporter.sendMail(mailOptions);
        console.log("¡Correo electrónico enviado correctamente!");
    } catch (error) {
        console.log("Error al enviar el correo electrónico:", error);
    }
}

const sendScore = async (email, subject, pitchScore, pitchFeedback, gameDesignScore, gameDesignFeedback, artScore, artFeedback, buildScore, buildFeedback, audioScore, audioFeedback, generalFeedback) => {
    try {
        let transporter = nodemailer.createTransport({
            host: "smtp.office365.com",
            port: 587,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAILPASSWORD
            },
            secureConnection: false,
            tls: { ciphers: 'SSLv3' }
        });

        const htmlTemplate = await fs.promises.readFile('services/email_template.html', 'utf-8');

        const htmlContent = replaceTokens(htmlTemplate, { 
            subject, 
            pitchScore, 
            pitchFeedback, 
            gameDesignScore, 
            gameDesignFeedback, 
            artScore, 
            artFeedback, 
            buildScore, 
            buildFeedback, 
            audioScore, 
            audioFeedback, 
            generalFeedback 
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: subject,
            html: htmlContent
        };

        await transporter.sendMail(mailOptions);
        console.log("¡Correo electrónico enviado correctamente!");
    } catch (error) {
        console.log("Error al enviar el correo electrónico:", error);
    }
}

module.exports = { sendEmail, sendScore };