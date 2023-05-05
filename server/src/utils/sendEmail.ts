import nodemailer from 'nodemailer';
import { __prod__ } from '../constants';

export const sendEmail = async (to: string, html: string) => {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
    tls: { rejectUnauthorized: false }, // avoid NodeJs self signed certificate error
  });

  let info = await transporter.sendMail({
    // from: 'Reddit 👻" admin<@reddit.com>',
    from: process.env.USERNAME,
    to,
    subject: 'Change Password ✔',
    html,
  });

  console.log('Message sent: %s', info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
};

export const templateEmail = (token: string, userId: number): string => {
  const baseUrl = __prod__ ? process.env.CORS_ORIGIN_PROD : process.env.CORS_ORIGIN_DEV;
  const template = `<h3>Hi there,</h3>
<h5>You recently requested to reset the password for your account. Click the <a href="${baseUrl}/change-password?token=${token}&userId=${userId}">HERE</a> to proceed.</h5>

<h5>If you did not request a password reset, please ignore this email or reply to let us know. This password reset link is only valid for the next 5 minutes.</h5>

<h5>Thanks, the Reddit team. </h5>`;
  return template;
};
