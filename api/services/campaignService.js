const axios = require('axios');

const getCampaignDetailInfo = async (param, accessToken) => {
  const config = {
    method: ?,
    url: ?,
    headers: {
      Authorization: `${accessToken}`,
    },
  };

  const result = await axios(config)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
    });
  return result;
};

module.exports = { getCampaignDetailInfo };
