const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const { uploadFile, unlinkFile } = require('../utils/s3');
const { uploadPicture, updateCaptureCount } = require('../models/schedulerDao');

const start = async (
  campaign_idx,
  searchParam,
  sns_type,
  job_idx,
  posting_url
) => {
  const browser = await puppeteer.launch({
    headless: false,
  });

  const page = await browser.newPage();

  await page.setViewport({
    width: 1366,
    height: 6000,
  });

  const urlResult = (sns_type) => {
    const paramArr = searchParam.split(',');
    const url = paramArr.map((param) => {
      const encodedParam = encodeURI(param);
      if (sns_type === 'BLOG') {
        return {
          uri: `https://search.naver.com/search.naver?where=view&sm=tab_jum&query=${encodedParam}`,
          keyword: param,
        };
      } else {
        return {
          uri: `https://www.instagram.com/explore/tags/${encodedParam}/`,
          keyword: param,
        };
      }
    });

    return url;
  };

  const naverCrawling = async ($) => {
    const lists = $('li.bx._svp_item');
    let result = [];
    await lists.each((i, list) => {
      // const influencer = $(list).find('a.name').text().trim();
      const blogUrl = $(list)
        .find('div.total_wrap.api_ani_send > div > a')
        .attr('href');
      result.push({ i, blogUrl });
    });
    return result;
  };

  const instagramCrawling = async ($) => {
    const lists = $('div._aabd._aa8k._aanf');
    let result = [];
    await lists.each((i, list) => {
      const url = $(list).find('a').attr('href');
      const blogUrl = `https://www.instagram.com${url}`;
      result.push({ i, blogUrl });
    });
    return result;
  };

  const crawlingResult = async (sns_type, $) => {
    const bodyBuilder = {
      BLOG: naverCrawling,
      INSTAGRAM: instagramCrawling,
    };
    const body = await bodyBuilder[sns_type]($);
    return body;
  };

  const includePostingURL = async (sliceResult) => {
    const urlArr = posting_url.split(',');
    let result = [];
    for (j of urlArr) {
      if (sliceResult.includes(j)) {
        result.push({ rank: urlArr.indexOf(j) + 1, url: j });
      }
    }
    return result;
  };

  for (i of urlResult(sns_type)) {
    await updateCaptureCount(job_idx);
    await page.goto(i.uri);
    await page.waitForTimeout(3000);
    const content = await page.content();
    const $ = await cheerio.load(content);
    const result = await crawlingResult(sns_type, $);

    const sliceResult = await result.slice(0, 20).map((e) => e.blogUrl);
    const postingUrl = await includePostingURL(sliceResult);

    const KR_TIME_DIFF = 9 * 60 * 60 * 1000;
    let koreaNow = new Date(new Date().getTime() + KR_TIME_DIFF);

    if (postingUrl[0]) {
      let filename = `${campaign_idx}_${koreaNow
        .toISOString()
        .substr(0, 19)}.png`;

      let screenshot = await page.screenshot({
        fullpage: true,
        path: `../backend/uploads/${filename}`,
      });

      let s3UploadImage = await uploadFile(
        screenshot,
        filename,
        koreaNow.getFullYear(),
        campaign_idx
      );

      await uploadPicture(
        job_idx,
        i.keyword,
        s3UploadImage.key,
        filename,
        s3UploadImage.Location,
        JSON.stringify(postingUrl)
      );

      await unlinkFile(filename);
    }
  }

  browser.close();
};

module.exports = { start };
