"use strict";

// Print all entries, across all of the sources, in chronological order.

const sortLogSources = require("./sort-util").sortLogSources;

module.exports = (logSources, printer) => {
  const sortedLogSources = logSources.map(logSource => {
    const log = logSource.pop();
    return { log, logSource };
  });

  sortedLogSources.sort((a, b) => {
    return a.log.date.getTime() - b.log.date.getTime();
  });

  while( sortedLogSources.length > 0 && sortedLogSources[0].log){
    const oldest = sortedLogSources[0];
    printer.print(oldest.log);
    oldest.log = sortedLogSources[0].logSource.pop();
    sortedLogSources[0].log = oldest.log;
    if( !oldest.log ){
      sortedLogSources.shift();//Drained
    }else{
      sortLogSources(sortedLogSources);
    }
  }
  printer.done();
  return console.log("Sync sort complete.");
};