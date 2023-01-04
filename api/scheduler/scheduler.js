const cron = require('node-cron');
const schedulerDao = require('../models/schedulerDao');
const crawlingService = require('../services/crawlingService');

const task = cron.schedule(' 0 0 * * * *', async () => {
  const KR_TIME_DIFF = 9 * 60 * 60 * 1000;
  let today = new Date(new Date().getTime() + KR_TIME_DIFF);
  const waitingScheduler = await schedulerDao.getSchedulerDetailInfo(
    `AND cj.state ='waiting'`
  );

  for (j of waitingScheduler) {
    let startday = new Date(j.start_day);
    let endday = new Date(j.end_day);

    if (startday < today && endday > today) {
      await schedulerDao.patchSchedulerWorking(j.idx);
    }
  }

  const scheduler = await schedulerDao.getSchedulerDetailInfo(
    `AND cj.state ='working'`
  );

  for (i of scheduler) {
    let startday = new Date(i.start_day);
    let endday = new Date(i.end_day);
    if (startday < today && endday > today) {
      await schedulerDao.updateRunCount(i.idx);
      await crawlingService.start(
        i.campaign_idx,
        i.keyword,
        i.sns_type,
        i.idx,
        i.posting_url
      );
    } else if (endday < today) {
      schedulerDao.patchSchedulerEnd(i.idx);
    }
  }
});

module.exports = { task };
