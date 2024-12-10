import nodemailer from 'nodemailer';

import { SMTP } from '../constants/index.js';
import { env } from '../utils/env.js';

const transporter = nodemailer.createTransport({
  host: env(SMTP.SMTP_HOST),
  port: Number(env(SMTP.SMTP_PORT)),
  auth: {
    user: env(SMTP.SMTP_USER),
    pass: env(SMTP.SMTP_PASSWORD),
  },

  // додавання цієї частини вирішує проблему, і запит успішний, але повідомлення на пошту не приходить
  tls: {
    rejectUnauthorized: false,
  },

  //
});

export const sendEmail = async (options) => {
  return await transporter.sendMail(options);
};
