"use strict";

// Print all entries, across all of the *async* sources, in chronological order.
const { AvlTree } = require('@datastructures-js/binary-search-tree');

const NodeItem = require('./node-item');

module.exports = (logSources, printer) => {
  return new Promise((resolve, reject) => {

    const processLogs = async () => {
      const avlTree = new AvlTree();

      for(let logSource of logSources){
        const log = await logSource.popAsync();
        if( log ){
          let nodeItem = new NodeItem(log, logSource);
          avlTree.insert(log.date.getTime(), nodeItem);
        }    
      }
    
      while(avlTree.count() > 0){
        let minNode = avlTree.min();
        printer.print(minNode.getValue().log);
        avlTree.remove(minNode.getKey());
        const log = await minNode.getValue().logSource.popAsync();
        if( log ){
          let newNodeItem = new NodeItem(log, minNode.getValue().logSource);
          avlTree.insert(log.date.getTime(), newNodeItem);
        }
      }
    
      printer.done();
      console.log("Async sort complete.");
    };

    processLogs().then(resolve);
  });
};
