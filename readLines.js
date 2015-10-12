var fs = require('fs');
var api = {getLines: get_line};
var Q = require('Q');

function get_line(filename, skip, numOfLines, callback) {
    var deferred = Q.defer()
    var stream = fs.createReadStream(filename, {
      flags: 'r',
      encoding: 'utf-8',
      fd: null,
      mode: 0666,
      bufferSize: 64 * 1024
    });

    stream.on('data', streamLastLines);

    var lineIndex = 0;
    var finalData = {
      // startingLine
      // dataAsArray 
    };

    function streamLastLines(data) {
      var splittedData = data.split("\n");
      lineIndex += splittedData.length;
      if (splittedData.length > numOfLines) {
        finalData.startingLine = lineIndex - numOfLines;
        finalData.dataAsArray = splittedData.slice(splittedData.length - numOfLines - 1);
      } else {
        // the actual data is fewer than the requested.
        if (!finalData.dataAsArray) {
          finalData = {
            startingLine: 1,
            dataAsArray: splittedData
          }
        } else {
           // The result is the last data stream
          finalData = {
            startingLine: lineIndex - numOfLines,
            dataAsArray: finalData.dataAsArray.slice(finalData.dataAsArray.length - (numOfLines - splittedData.length) - 1).concat(splittedData)
          };
        }
      }
    }

    stream.on('error', function(err){
      deferred.reject(err);
    });

    stream.on('end', endOfFile);

    function endOfFile() {
      stream.destroy();
      finalData.data = finalData.dataAsArray.join('<br/>');
      delete finalData.dataAsArray;
      deferred.resolve(finalData);
      // var nl2br  = require('nl2br');
      // XHTML Way 
      // nl2br('Base\nballs');  // returns 'Base<br/>balls' 
      // Non-XHTML Way 
      // nl2br('Base\nballs', false);  // returns 'Base<br>balls' 
    }

    return deferred.promise;
}

module.exports = api
