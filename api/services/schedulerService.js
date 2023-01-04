const schedulerDao = require('../models/schedulerDao.js');
const { getCampaignDetailInfo } = require('../services/campaignService');
const { getFile } = require('../utils/s3');

const postScheduler = async (
  idx,
  name,
  campaign_idx,
  startDay,
  endDay,
  keyword,
  accessToken
) => {
  const campaign = await getCampaignDetailInfo(campaign_idx, accessToken);
  const username = campaign.data.postings.map((x) => x.sns_info.uid);
  const url = campaign.data.postings.map((x) => x.url);
  const param = {
    campaign_idx: campaign.data.compt.idx,
    campaign_title: campaign.data.compt.title,
    sns_type: campaign.data.compt.sns_channel,
    posting_count: url.length,
    keyword: keyword,
    start_day: startDay,
    end_day: endDay,
    admin_name: name,
    admin_idx: idx,
    username: username,
    url: url,
    company_name: campaign.data.advertiser.company_name,
  };
  await schedulerDao.postScheduler(param);
};

const getSchedulerDetailInfo = async (idx) => {
  let result = ``;
  if (idx) {
    result += `AND cj.idx =${idx}`;
  }
  let jobInfo = await schedulerDao.getSchedulerDetailInfo(result);
  const picture = await schedulerDao.getPicture(idx);
  for (i of picture) {
    i.rank = JSON.parse(i.rank);
  }
  for (i of jobInfo) {
    i.pictures = picture;
  }

  return jobInfo;
};

const patchScheduler = async (scheduler_idx, startDay, endDay, keyword) => {
  await schedulerDao.patchScheduler(scheduler_idx, startDay, endDay, keyword);
};

const deleteScheduler = async (idx) => {
  await schedulerDao.deleteScheduler(idx);
};

const getImage = async (key) => {
  return await getFile(key);
};

module.exports = {
  postScheduler,
  getSchedulerDetailInfo,
  patchScheduler,
  deleteScheduler,
  getImage,
};
