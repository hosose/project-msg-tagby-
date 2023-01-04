const express = require('express');

const { loginRequired } = require('../utils/checkuser.js');
const schedulerController = require('../controllers/schedulerController.js');

const router = express.Router();

router.post('', loginRequired, schedulerController.postScheduler);
router.get('', loginRequired, schedulerController.getSchedulerDetailInfo);
router.get('/image', schedulerController.getImage);
router.patch('/:idx', loginRequired, schedulerController.patchScheduler);
router.delete('/:idx', loginRequired, schedulerController.deleteScheduler);

module.exports = router;
