var http = require("http");

var apiKey = "RicardoS-0c4e-433c-9c47-b233462c797d";
var query = "harry%20potter%20phoenix";

http.get("http://svcs.ebay.com/services/search/FindingService/v1?" +
          "OPERATION-NAME=findItemsByKeywords" +
          "&SERVICE-VERSION=1.0.0" +
          "&SECURITY-APPNAME=" + apiKey +
          "&RESPONSE-DATA-FORMAT=JSON" +
          "&REST-PAYLOAD" +
          "&keywords=" + query, function(res) {

  console.log("Got response: " + res.statusCode);
  var body = '';
  res.on('data', function(chunk) {
    body += chunk;
  });
  res.on('end', function () {
    var result = JSON.parse(body);
    console.log(result.findItemsByKeywordsResponse[0].searchResult[0].item[0]);
    console.log(result.findItemsByKeywordsResponse[0].paginationOutput);
  });
}).on('error', function(e) {
  console.log("Got error: " + e.message);
});
