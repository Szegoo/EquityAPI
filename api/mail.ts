import nodemailer from 'nodemailer';
require('dotenv').config();

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL,
        pass: process.env.MAIL_PASS
    }
});

let mailOptions = {
    from: process.env.MAIL,
    to: '',
    subject: 'Warning',
    text: "Your company email is not found",
}

export function sendMail(receiver:string) {
    mailOptions.to = receiver;
    transporter.sendMail(mailOptions, (err, info) => {
        if(err) {
            console.log(err);
        }else {
            console.log(info);
        }
    })
}
