var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});

var index = "ebay";
var type = "searchResults";

module.exports = function(id, data, callback) {
  client.index({
    index: index,
    type: type,
    id: id,
    body: data
  }, function (error, response) {
    if(error) {
      callback(error);
    } else {
      callback(null, response);
    }
  });
}
