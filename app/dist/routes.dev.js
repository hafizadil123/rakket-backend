/* eslint-disable linebreak-style */
/* eslint-disable strict */
/* eslint-disable no-unused-vars */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports['default'] = void 0;

const _express = require('express');

const _user = _interopRequireDefault(require('./controllers/user.controller'));

const _service = _interopRequireDefault(require('./controllers/service.controller'));

const _expert = _interopRequireDefault(require('./controllers/expert.controller'));

const _category = _interopRequireDefault(require('./controllers/category.controller'));

const _appointment = _interopRequireDefault(require('./controllers/appointment.controller'));

const _employee = _interopRequireDefault(require('./controllers/employee.controller'));

const _rating = _interopRequireDefault(require('./controllers/rating.controller'));

const _authenticate = _interopRequireDefault(require('./middleware/authenticate'));

const _profileMedia = _interopRequireDefault(require('./middleware/profile-media'));

const _errorHandler = _interopRequireDefault(require('./middleware/error-handler'));

const _employeeAuth = _interopRequireDefault(require('./middleware/employee-auth'));

const _expertAuth = _interopRequireDefault(require('./middleware/expert-auth'));

const _adminAuth = _interopRequireDefault(require('./middleware/admin-auth'));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { 'default': obj };
}

/* eslint-disable max-len */
const routes = new _express.Router(); // Users Routes

routes.post('/api/users/register', _user['default'].register);
routes.post('/api/users/login', _user['default'].login);
routes.post('/api/users/resetPassword', _authenticate['default'], _user['default'].resetPassword);
routes.post('/api/users/sendforgetPasswordEmail', _user['default'].sendForgetPassEmail);
routes.post('/api/users/forgetPassword/:userId/:token', _user['default'].forgetPassword);
routes.post('/api/users/addAppointment', _authenticate['default'], _appointment['default'].addAppointment);
routes.get('/api/users/getAppointmentHistory', _authenticate['default'], _appointment['default'].getAppointmentHistory);
routes.get('/api/users/getScheduleAppointment', _authenticate['default'], _appointment['default'].getScheduleAppointment);
routes.post('/api/users/createAppointmentCharge', _authenticate['default'], _appointment['default'].createAppointmentCharge);
routes.post('/api/users/changeProfile', _authenticate['default'], _user['default'].changeProfile);
routes.get('/api/users/deactivateAccount', _authenticate['default'], _user['default'].deactivateAccount);
routes.get('/api/users/getProfile', _authenticate['default'], _user['default'].getProfile);
routes.post('/api/users/changePicture', [_authenticate['default'], _profileMedia['default'].fields([{
  name: 'imageUrl',
  maxCount: 1,
}])], _user['default'].changePicture); // Experts Routes

routes.get('/api/experts/:serviceId', _expert['default'].getServiceExperts);
routes.get('/api/expertDetail/:expertId', _expert['default'].getExpertDetail);
routes.get('/api/getExperts', _expert['default'].getAllExperts);
routes.get('/api/getExpertProfile', [_authenticate['default'], _expertAuth['default']], _expert['default'].getExpertProfile);
routes.post('/api/editExpertProfile', [_authenticate['default'], _expertAuth['default']], _expert['default'].editExpertProfile);
routes.get('/api/getExpertAppointmentsByStatus/:status', [_authenticate['default'], _expertAuth['default']], _expert['default'].getExpertAppointmentsByStatus);
routes.post('/api/changeExpertAppointmentStatus', [_authenticate['default'], _expertAuth['default']], _expert['default'].changeExpertAppointmentStatus);
routes.post('/api/addExpertEmployee', [_authenticate['default'], _expertAuth['default'], _profileMedia['default'].fields([{
  name: 'imageUrl',
  maxCount: 1,
}])], _expert['default'].addExpertEmployee);
routes.get('/api/getExpertAllAppointments', [_authenticate['default'], _expertAuth['default']], _expert['default'].getExpertAllAppointments);
routes.get('/api/getExpertEmployees', [_authenticate['default'], _expertAuth['default']], _expert['default'].getExpertEmployees);
routes.get('/api/getExpertStats', [_authenticate['default'], _expertAuth['default']], _expert['default'].getExpertStats);
routes.post('/api/deleteExpertEmployee', [_authenticate['default'], _expertAuth['default']], _expert['default'].deleteExpertEmployee);
routes.post('/api/expertAssignAppointment', [_authenticate['default'], _expertAuth['default']], _expert['default'].expertAssignAppointment);
routes.post('/api/changeExpertPicture', [_authenticate['default'], _expertAuth['default'], _profileMedia['default'].fields([{
  name: 'imageUrl',
  maxCount: 1,
}])], _expert['default'].changeExpertPicture); // Employee Routes

routes.get('/api/getEmployeeStats', [_authenticate['default'], _employeeAuth['default']], _employee['default'].getEmployeeStats);
routes.get('/api/getEmployeeProfile', [_authenticate['default'], _employeeAuth['default']], _employee['default'].getEmployeeProfile);
routes.get('/api/getEmployeeAppointmentStatus/:status', [_authenticate['default'], _employeeAuth['default']], _employee['default'].getEmployeeAppointmentStatus);
routes.post('/api/getEmployeeAssignAppointments', [_authenticate['default'], _employeeAuth['default']], _employee['default'].getEmployeeAssignAppointments);
routes.post('/api/changeEmployeeAppointmentStatus', [_authenticate['default'], _employeeAuth['default']], _employee['default'].changeEmployeeAppointmentStatus); // Services Routes

routes.get('/api/services', _service['default'].getServices); // Rating Routes

routes.post('/api/addAppointmentRating', _rating['default'].addAppointmentRating); // Category Routes

routes.get('/api/categories/:serviceId', _category['default'].getServiceCategories);
routes.use(_errorHandler['default']);
const _default = routes;
exports['default'] = _default;
