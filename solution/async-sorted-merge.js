"use strict";

// Print all entries, across all of the *async* sources, in chronological order.
const sortLogSources = require("./sort-util").sortLogSources;

module.exports = (logSources, printer) => {
  return new Promise((resolve, reject) => {
    

    const processLogs = async () => {
      const sortedLogSources = await Promise.all(logSources.map(async (logSource) => {
        const log = await logSource.popAsync();
        return { log, logSource };
      }));
    
      sortedLogSources.sort((a, b) => {
        return a.log.date.getTime() - b.log.date.getTime();
      });
      while( sortedLogSources.length > 0 && sortedLogSources[0].log){
        const oldest = sortedLogSources[0];
        printer.print(oldest.log);
        oldest.log = await sortedLogSources[0].logSource.popAsync();
        sortedLogSources[0].log = oldest.log;
        if( !oldest.log ){
          sortedLogSources.shift();//Drained
        }else{
          sortLogSources(sortedLogSources);
        }
      }
      printer.done();
      console.log("Async sort complete.");
    };

    processLogs().then(resolve);
  });
};
