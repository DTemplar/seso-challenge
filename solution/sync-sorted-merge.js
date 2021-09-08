"use strict";

// Print all entries, across all of the sources, in chronological order.


const { AvlTree } = require('@datastructures-js/binary-search-tree');

const NodeItem = require('./node-item');

module.exports = (logSources, printer) => {

  const avlTree = new AvlTree();
  
  logSources.forEach(logSource => {
    const log = logSource.pop();
    if( log ){
      let nodeItem = new NodeItem(log, logSource);
      avlTree.insert(log.date.getTime(), nodeItem);
    }    
  });

  while(avlTree.count() > 0){
    let minNode = avlTree.min();
    printer.print(minNode.getValue().log);
    avlTree.remove(minNode.getKey());
    const log = minNode.getValue().logSource.pop();
    if( log ){
      let newNodeItem = new NodeItem(log, minNode.getValue().logSource);
      avlTree.insert(log.date.getTime(), newNodeItem);
    }
  }
  printer.done();
  return console.log("Sync sort complete.");
};