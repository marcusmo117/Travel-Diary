const config = require("cloudinary");
const uploader = require("cloudinary");
const cloudinaryConfig = (req, res, next) => {
  config({
    cloud_name: drs69vk9t,
    api_key: 393247617175631,
    api_secret: xmzrWuqLiAPABboGeQH7L3Itykk,
  });
  next();
};
exports.module = {
  cloudinaryConfig,
  uploader,
};
