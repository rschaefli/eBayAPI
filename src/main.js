var http = require("http");
var schedule = require('node-schedule');

var apiKey = "RicardoS-0c4e-433c-9c47-b233462c797d";
var query = "pokemon%20base%20set%20first%20edition%20booster%20box";

var cronPattern = "* * * * *";


var makeApiQuery = function(cb) {
  http.get("http://svcs.ebay.com/services/search/FindingService/v1?" +
            "OPERATION-NAME=findItemsByKeywords" +
            "&SERVICE-VERSION=1.0.0" +
            "&SECURITY-APPNAME=" + apiKey +
            "&RESPONSE-DATA-FORMAT=JSON" +
            "&REST-PAYLOAD" +
            "&keywords=" + query, function(res) {

    var body = '';

    res.on('data', function(chunk) {
      body += chunk;
    });

    res.on('end', function () {
      var result = JSON.parse(body);
      cb(result);
    });
  }).on('error', function(e) {
    console.log("Got error: " + e.message);
    cb(undefined);
  });
}


schedule.scheduleJob(cronPattern, function() {
    console.log('Cron job running..');

    makeApiQuery(function callback(result) {
      console.log(result.findItemsByKeywordsResponse[0].searchResult[0].item[0]);
      console.log(result.findItemsByKeywordsResponse[0].paginationOutput);
    });
});
