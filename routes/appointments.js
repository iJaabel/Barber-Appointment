'use strict';

const express = require('express');
const momentTimeZone = require('moment-timezone');
const moment = require('moment');
const { Appointment } = require('../src/db');

/* eslint-disable new-cap */
const router = express.Router();

const getTimeZones = function() {
  return momentTimeZone.tz.names();
};

// ---

/**
 * GET: /appointments
 * What it does:
 * When a user visits /appointments, this route fetches all appointments from the database using Appointment.find().
 * It then renders the appointments/index Pug template, passing the list of appointments to the view.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */

router.get('/', function(req, res, next) {
  Appointment.find().then(function(appointments) {
    res.render('appointments/index', { appointments: appointments });
  });
});

/**
 * GET: /appointments/create
 * What it does:
 * This route renders the appointments/create Pug template, passing a new Appointment object to the view.
 * The new Appointment object is created with default values for name, phoneNumber, notification, timeZone, and time.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */

router.get('/create', function(req, res, next) {
  res.render('appointments/create', {
    timeZones: getTimeZones(),
    appointment: new Appointment({
      name: '',
      phoneNumber: '',
      notification: '',
      timeZone: '',
      time: '',
    }),
  });
});

/**
 * GET: /appointments/:id/edit
 * What it does:
 * This route fetches a specific appointment by ID and renders the appointments/edit Pug template, passing the appointment and list of time zones to the view.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */

router.get('/:id/edit', function(req, res, next) {
  const id = req.params.id;
  Appointment.findOne({ _id: id }).then(function(appointment) {
    res.render('appointments/edit', {
      timeZones: getTimeZones(),
      appointment: appointment,
    });
  });
});

// ---

/**
 * POST: /appointments
 * What it does:
 * This route creates a new appointment based on the form data submitted from the appointments/create page.
 * It then redirects the user back to the /appointments page.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */

router.post('/', function(req, res, next) {
  const name = req.body.name;
  const phoneNumber = req.body.phoneNumber;
  const notification = req.body.notification;
  const timeZone = req.body.timeZone;
  const time = moment(req.body.time, 'YYYY-MM-DD hh:mma');

  const appointment = new Appointment({
    name: name,
    phoneNumber: phoneNumber,
    notification: Number(notification),
    timeZone: timeZone,
    time: time,
  });
  appointment.save().then(function() {
    res.redirect('/');
  });
});

/**
 * POST: /appointments/:id/edit
 * What it does:
 * This route updates an existing appointment based on the form data submitted from the appointments/:id/edit page.
 * It then redirects the user back to the /appointments page.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */

router.post('/:id/edit', function(req, res, next) {
  const id = req.params.id;
  const name = req.body.name;
  const phoneNumber = req.body.phoneNumber;
  const notification = req.body.notification;
  const timeZone = req.body.timeZone;
  const time = moment(req.body.time, 'YYYY-MM-DD hh:mma');

  Appointment.findOne({ _id: id }).then(function(appointment) {
    appointment.name = name;
    appointment.phoneNumber = phoneNumber;
    appointment.notification = notification;
    appointment.timeZone = timeZone;
    appointment.time = time;

    appointment.save().then(function() {
      res.redirect('/');
    });
  });
});

/**
 *  POST: /appointments/:id/delete
 * What it does:
 * This route deletes an existing appointment by ID.
 * It then redirects the user back to the /appointments page.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */

router.post('/:id/delete', function(req, res, next) {
  const id = req.params.id;

  Appointment.remove({ _id: id }).then(function() {
    res.redirect('/');
  });
});

module.exports = router;
