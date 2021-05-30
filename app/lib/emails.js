/* eslint-disable linebreak-style */
/* eslint-disable no-tabs */
/* eslint-disable max-len */
export const sendPasswordResetTemplate = (user, link) =>
  `Hi <strong>${user.username} !</strong><br> Here is Your Update Password Link, Please Click: <strong><a href='${link}'>Here</a></strong> Which is only valid for 2 minutes `;

export const sendEmailVerificationTemplate = (user, link) =>
  `Hi <strong>${user.username} !</strong><br> Here is Your Email Verification Link, Please Click: <strong><a href='${link}'>Here</a></strong> `;

export const inquiryEmailTemplate = (user) => `Hi <strong> There! </strong> <br> From Govver dashboard this user ${user.fromEmail} want to claim this from you as he voted previously, please have a look on his Bill, <br> <strong> ${user.text} </strong>,<br> you can find his email from CC <br> Thanks <br> Govver.com`;
export const sendAddEmployeeEmail = (user) =>
  `<p>Hi <strong>${user.firstName} ${user.lastName}!</strong></p>
  <p>You have been add as an employee: Here is your login credentials</p>
  <p><strong>Your Email: ${user.email}</strong></p>
  <p><strong>Your Password:  ${user.password}</strong></p>
  <p><strong>Regards: unnic corporation</strong></p>
  `;
export const ratingEmailTemplate = (user, link) =>
  `<p>Hi <strong>${user.firstName} ${user.lastName}!</strong></p>
  <p>Your appointment have been completed So, rate the company</p>
  <p><strong>Rating Link:  <a href="${link}">Here</a></strong></p>
  <p><strong>Regards: unnic corporation</strong></p>
  `;

