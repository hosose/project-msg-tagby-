const express = require('express');

const router = express.Router();

const campaignRouter = require('./campaignRouter');
const schedulerRouter = require('./schedulerRouter');
const task = require('../scheduler/scheduler');

router.use('/campaign', campaignRouter);
router.use('/scheduler', schedulerRouter);

module.exports = router;
