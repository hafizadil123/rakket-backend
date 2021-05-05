/* eslint-disable linebreak-style */
import nodemailer from 'nodemailer';
import { sendPasswordResetTemplate, sendAddEmployeeEmail, ratingEmailTemplate, inquiryEmailTemplate } from './emails';
import Constants from '../config/constants';

export const sendResetPassEmail = (user, link) => {
  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    service: Constants.messages.service,
    auth: {
      user: Constants.messages.email, // generated ethereal user
      pass: Constants.messages.password, // generated ethereal password
    },
  });

  // setup email data with unicode symbols
  const mailOptions = {
    from: Constants.messages.email, // sender address
    to: [user.email], // list of receivers
    subject: 'Link To Reset Password', // Subject line
    // text: 'Hello world?', // plain text body
    html: sendPasswordResetTemplate(user, link), // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  });
};


export const sendRatingEmail = (user, link) => {
  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    service: Constants.messages.service,
    auth: {
      user: Constants.messages.email, // generated ethereal user
      pass: Constants.messages.password, // generated ethereal password
    },
  });

  // setup email data with unicode symbols
  const mailOptions = {
    from: Constants.messages.email, // sender address
    to: [user.email], // list of receivers
    subject: 'Rate Appointment', // Subject line
    html: ratingEmailTemplate(user, link), // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  });
};


export const sendEmployeeEmail = (user, link) => {
  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    service: Constants.messages.service,
    auth: {
      user: Constants.messages.email, // generated ethereal user
      pass: Constants.messages.password, // generated ethereal password
    },
  });

  // setup email data with unicode symbols
  const mailOptions = {
    from: Constants.messages.email, // sender address
    to: [user.email], // list of receivers
    subject: 'Add Company Employee', // Subject line
    html: sendAddEmployeeEmail(user), // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  });
};


export const sendInquiryEmail = (user) => {
  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    service: Constants.messages.service,
    auth: {
      user: Constants.messages.email, // generated ethereal user
      pass: Constants.messages.password, // generated ethereal password
    },
  });

  // setup email data with unicode symbols
  const mailOptions = {
    from: Constants.messages.email, // sender address
    to: [user.toEmail, user.fromEmail], // list of receivers
    subject: 'New Claim: From Govver.com - User wants to connect You', // Subject line
    html: inquiryEmailTemplate(user), // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  });
};
