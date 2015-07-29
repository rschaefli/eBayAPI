var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: process.env.ELASTICSEARCH_HOST + ':9200',
  log: 'trace'
});

//var index = "ebay";
var index = "test2";
var type = "searchResults";

module.exports = {
    index: function(id, data, callback) {
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
    },
    ping: function(callback) {
      client.ping({

      }, function(error, response) {
        if(error) {
          callback(error);
        } else {
          callback(null, response);
        }
      });
    }
}
