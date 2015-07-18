var http = require("http");
var schedule = require('node-schedule');
var indexer = require('./es-indexer');

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
      cb(undefined, result);
    });
  }).on('error', function(err) {
    cb(err);
  });
}


schedule.scheduleJob(cronPattern, function() {
    console.log('Cron job running..');

    makeApiQuery(function callback(err, result) {
      if(err) {
        console.log("Got error: " + err);
      } else {
        var result = result.findItemsByKeywordsResponse[0];
        //var totalEntries = result.paginationOutput[0].totalEntries[0];

        // TODO: Handle pagination. This only handles the first page.
        // This will also likely throw an exception for results > 100
        result.searchResult[0].item.forEach(function(item) {
          //console.log(item);
          indexer(item.itemId[0], item, function(err, response) {
            if(err){
              console.error("Encountered an error indexing!", err);
            } else {
              console.log("Response from ES index request: " + response);
            }
          })
        });
      }
    });
});
