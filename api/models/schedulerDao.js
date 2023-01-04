const { appDataSource } = require('./data_source');

const postScheduler = async (param) => {
  let {
    campaign_idx,
    campaign_title,
    sns_type,
    posting_count,
    keyword,
    start_day,
    end_day,
    admin_name,
    admin_idx,
    username,
    url,
    company_name,
  } = param;
  const queryRunner = appDataSource.createQueryRunner();

  await queryRunner.connect();

  await queryRunner.startTransaction();
  try {
    const job = await queryRunner.query(
      `
      INSERT INTO capture_job_info(
        campaign_idx,
        campaign_title,
        sns_type,
        posting_count,
        keyword,
        start_day,
        end_day,
        admin_idx,
        admin_name,
        company_name
      ) VALUES(?,?,?,?,?,?,?,?,?,?)
      `,
      [
        campaign_idx,
        campaign_title,
        sns_type,
        posting_count,
        keyword,
        start_day,
        end_day,
        admin_idx,
        admin_name,
        company_name,
      ]
    );

    const posting_info = await queryRunner.query(
      `
      INSERT INTO posting_info(
        job_idx,
        username,
        posting_url
      ) VALUES(?,?,?)
      `,
      [job.insertId, `${username}`, `${url}`]
    );

    await queryRunner.commitTransaction();
  } catch (error) {
    console.log(error);
    await queryRunner.rollbackTransaction();
    const err = new Error('Transaction Failure');
    throw err;
  } finally {
    await queryRunner.release();
  }
};

const getSchedulerDetailInfo = async (result) => {
  return await appDataSource.query(
    `
    SELECT
      cj.idx,
      cj.campaign_idx,
      cj.campaign_title,
      cj.sns_type,
      cj.start_day,
      cj.end_day,
      cj.keyword,
      cj.last_run_at,
      cj.run_count,
      cj.captured_count,
      cj.posting_count,
      cj.state,
      cj.admin_name,
      cj.company_name,
	    pi.username,
      pi.posting_url
    FROM
      capture_job_info cj
    LEFT JOIN (
      SELECT
        job_idx ,
        username,
        posting_url
      FROM
        posting_info
      GROUP BY
        job_idx
    ) pi ON cj.idx = pi.job_idx
    WHERE cj.state != 'deleted' ${result}
    GROUP BY cj.idx
    `
  );
};

const patchSchedulerEnd = async (idx) => {
  return await appDataSource.query(
    `
    UPDATE
      capture_job_info
    SET
      state = 'end'
    WHERE idx = ?
    `,
    [idx]
  );
};

const patchSchedulerWorking = async (idx) => {
  return await appDataSource.query(
    `
    UPDATE
      capture_job_info
    SET
      state = 'working'
    WHERE idx = ?
    `,
    [idx]
  );
};

const patchScheduler = async (scheduler_idx, startDay, endDay, keyword) => {
  await appDataSource.query(
    `
    UPDATE
      capture_job_info
    SET
      keyword = ?,
      start_day = ?,
      end_day = ?
    WHERE idx =?
    `,
    [keyword, startDay, endDay, scheduler_idx]
  );
};

const deleteScheduler = async (idx) => {
  await appDataSource.query(
    `
    UPDATE
      capture_job_info
    SET
      state = 'deleted'
    WHERE idx =?
    `,
    [idx]
  );
};

const updateRunCount = async (idx) => {
  await appDataSource.query(
    `
    UPDATE
      capture_job_info
    SET
       run_count = run_count + 1
    WHERE idx = ${idx}
    `
  );
};

const updateCaptureCount = async (idx) => {
  await appDataSource.query(
    `
    UPDATE
      capture_job_info
    SET
       captured_count = captured_count + 1
    WHERE idx = ${idx}
    `
  );
};

const getPicture = async (job_idx) => {
  return await appDataSource.query(
    `
    SELECT
      job_idx,
      bucket_path,
      file_name,
      image_url,
      rank,
      created_at,
      keyword
    FROM
      capture_result_info
    WHERE
      job_idx = ?
    `,
    [job_idx]
  );
};

const uploadPicture = async (
  job_idx,
  keyword,
  bucket_path,
  file_name,
  image_url,
  rank
) => {
  return await appDataSource.query(
    `
    INSERT INTO 
      capture_result_info(
        job_idx,
        keyword,
        bucket_path,
        file_name,
        image_url,
        rank
      ) 
    VALUES(?,?,?,?,?,?)
    `,
    [job_idx, keyword, bucket_path, file_name, image_url, rank]
  );
};

module.exports = {
  postScheduler,
  getSchedulerDetailInfo,
  patchSchedulerEnd,
  patchSchedulerWorking,
  patchScheduler,
  deleteScheduler,
  updateRunCount,
  updateCaptureCount,
  getPicture,
  uploadPicture,
};
