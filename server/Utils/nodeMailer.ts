import nodemailer from 'nodemailer';
const Transporter = nodemailer.createTransport({
    port: 465,
    service: 'gmail',
    host: 'smtp.gmail.com',

    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    },
    secure: true,
})


export const sendEmail = async (to: string, subject: string, data: {
    text?: string,
    html?: string,
}) => Transporter.sendMail({
    from: process.env.SMTP_USER as string,
    to,
    subject,
    html: data.html,
    text: data.text
});


