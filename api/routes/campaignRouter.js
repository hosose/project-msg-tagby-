const express = require('express');

const router = express.Router();

const { loginRequired } = require('../utils/checkuser.js');
const campaignController = require('../controllers/campaignController.js');

router.get(
  '/:campaignId',
  loginRequired,
  campaignController.getCampaignDetailInfo
);

module.exports = router;
