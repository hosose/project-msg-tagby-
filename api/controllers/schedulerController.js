const schedulerService = require('../services/schedulerService.js');
const { catchAsync, raiseCustomError } = require('../utils/error');

const postScheduler = catchAsync(async (req, res) => {
  const { idx, name } = req.user.data;
  const { campaign_idx, startDay, endDay, keyword } = req.body;
  const accessToken = req.headers.authorization;
  if (!campaign_idx || !startDay || !endDay || !keyword) {
    raiseCustomError('KEY_ERROR', 400);
  }

  await schedulerService.postScheduler(
    idx,
    name,
    campaign_idx,
    startDay,
    endDay,
    keyword,
    accessToken
  );

  return res.status(200).json('post success!');
});

const getSchedulerDetailInfo = catchAsync(async (req, res) => {
  const schedule = await schedulerService.getSchedulerDetailInfo(req.query.idx);

  return res.status(200).json(schedule);
});

const patchScheduler = catchAsync(async (req, res) => {
  const scheduler_idx = req.params.idx;
  const { startDay, endDay, keyword } = req.body;
  await schedulerService.patchScheduler(
    scheduler_idx,
    startDay,
    endDay,
    keyword
  );

  return res.status(201).json({ message: 'patch success' });
});

const deleteScheduler = catchAsync(async (req, res) => {
  const idx = req.params.idx;
  await schedulerService.deleteScheduler(idx);
  return res.status(204).json({ message: 'delete success' });
});

const getImage = catchAsync(async (req, res) => {
  const bucketPath = req.query.bucketPath;

  const image = await schedulerService.getImage(bucketPath);

  await image.pipe(res);
});

module.exports = {
  postScheduler,
  getSchedulerDetailInfo,
  patchScheduler,
  deleteScheduler,
  getImage,
};
