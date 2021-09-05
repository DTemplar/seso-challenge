"use strict";

/**
 * Sort logSources to have the oldest log at the start of the array
 * 
 */
module.exports.sortLogSources = (unsortedSources) => {
  if (unsortedSources.length < 2) {
    return;
  }
  let currentPos = 0;
  const unsortedLogSource = unsortedSources[currentPos];
  let index = 1;
  let nextLogSource = unsortedSources[index];

  while (unsortedLogSource && nextLogSource && unsortedLogSource.log.date.getTime() > nextLogSource.log.date.getTime()) {
    const tempRecord = nextLogSource;
    unsortedSources[currentPos] = tempRecord;
    unsortedSources[nextLogSource] = unsortedLogSource;
    if (index + 1 > unsortedSources.length) {
      break;
    }
    nextLogSource = unsortedSources[++index];
    currentPos++;
  }
};