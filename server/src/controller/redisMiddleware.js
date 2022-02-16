/** @format */

var redis = require("redis");
var client = redis.createClient();
client.connect();
var redisMiddle = function (dataType) {
  return function (req, res, next) {
    client.get(dataType).then(function (response) {
      if (response) {
        res.json(JSON.parse(response));
      } else {
        console.log("error in redis");
        next();
        //res.json({message:"error in redis"})
      }
    });
  };
};
module.exports = redisMiddle;
