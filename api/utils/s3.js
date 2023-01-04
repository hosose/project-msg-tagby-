const S3 = require('aws-sdk/clients/s3');
const fs = require('fs');
const util = require('util');

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const unlinkFile = (link) => {
  fs.unlink(`../backend/uploads/${link}`, (err) => {
    if (err) {
      console.log(err);
    }
  });
};

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey,
});

const uploadFile = async (screenshot, filename, year, idx) => {
  const uploadParams = {
    Bucket: bucketName,
    Body: screenshot,
    Key: `${year}/${idx}/${filename}`,
  };

  return await s3
    .upload(uploadParams)
    .promise()
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error(error);
    });
};

function deleteFile(key) {
  const deleteParams = {
    Bucket: bucketName,
    Key: key,
  };

  s3.deleteObject(deleteParams).promise();
}

const getFile = async (key) => {
  objectParams2 = {
    Bucket: bucketName, // 다운할 버킷
    Key: key,
  };

  return s3.getObject(objectParams2).createReadStream();
};
module.exports = { unlinkFile, uploadFile, deleteFile, getFile };
