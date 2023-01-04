const axios = require('axios');

const loginRequired = async (req, res, next) => {
  const accessToken = req.headers.authorization;

  if (!accessToken) {
    const error = new Error('NEED_ACCESS_TOKEN');
    error.statusCode = 401;
    return res.status(error.statusCode).json({ message: error.message });
  }

  const config = {
    method: ?,
    url: ?,
    headers: {
      Authorization: `${accessToken}`,
    },
  };

  const user = await axios(config)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
    });

  if (user.data.message === 'Unauthorized') {
    const error = new Error('can not access');
    error.statusCode = 401;
    return res.status(error.statusCode).json({ message: error.message });
  }
  req.user = user;
  next();
};

module.exports = { loginRequired };
