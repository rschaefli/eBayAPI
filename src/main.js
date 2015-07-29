var http = require("http");
var schedule = require('node-schedule');
var indexer = require('./es-indexer');

var apiKey = "RicardoS-0c4e-433c-9c47-b233462c797d";
//var operationName="findItemsByKeywords";
//var responseFieldName="findItemsByKeywordsResponse";
var operationName="findCompletedItems";
var responseFieldName="findCompletedItemsResponse";
//var query = "pokemon base set first edition booster box";
var query="apple iphone 5"

var cronPattern = "* * * * *";

var makeApiQuery = function(args, cb) {
  http.get("http://svcs.ebay.com/services/search/FindingService/v1?" +
            "OPERATION-NAME=" + operationName +
            "&SERVICE-VERSION=1.0.0" +
            "&SECURITY-APPNAME=" + apiKey +
            "&RESPONSE-DATA-FORMAT=JSON" +
            "&REST-PAYLOAD" +
            "&keywords=" + query +
            "&paginationInput.pageNumber=" + args.currentPage, function(res) {

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

// Give Elaticsearch time to come up
setTimeout(function(err, response) {
  //schedule.scheduleJob(cronPattern, function() {
  //    console.log('Cron job running..');
      //TODO: Rename to queryArgs, store query and operationName in here as well?
      var args = {};
      args.currentPage = 1;
      args.maxPages = 100;

      getAllResults(args);
  //});

  function getAllResults(args) {
    makeApiQuery(args, function callback(err, result) {
      if(err) {
        console.log("Got error: " + err);
      } else {
        var result = result[responseFieldName][0];
        // Process each item in the results
        result.searchResult[0].item.forEach(function(item) {
          item.searchQuery = query;
          // Index each item with Elasticsearch
          indexer.index(item.itemId[0], item, function(err, response) {
            if(err){
              console.error("Encountered an error indexing!", err);
            } else {
              console.log("Response from ES index request: " + response);
            }
          })
        });

        // Update the search args for pagination
        args.maxPages = result.paginationOutput[0].totalPages[0] > 100 ? 100 : result.paginationOutput[0].totalPages[0];
        if(args.currentPage < args.maxPages) {
          args.currentPage = args.currentPage + 1;
          getAllResults(args);
        } else {
          console.log("Reached end of all pages for query " + query);
        }
      }
    });
  }
}, 20000);
