const campaignService = require('../services/campaignService.js');
const { catchAsync } = require('../utils/error');

const getCampaignDetailInfo = catchAsync(async (req, res) => {
  const accessToken = req.headers.authorization;
  const campaign = await campaignService.getCampaignDetailInfo(
    req.params.campaignId,
    accessToken
  );
  const result = {
    title: campaign.data.compt.title,
    company: campaign.data.advertiser.company_name,
  };
  return res.status(200).json(result);
});

module.exports = { getCampaignDetailInfo };
