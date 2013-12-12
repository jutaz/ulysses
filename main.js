var cluster = require('cluster');
var os = require('os');

function ulysses(opts) {
    if(!opts) {
        opts = {};
    }
    this.numOfWorkers = opts.workerNum || os.cpus().length;
}

ulysses.prototype.start = function() {

}

ulysses.prototype.stop = function() {

}

ulysses.prototype.restart = function() {

}

ulysses.prototype.reload = function() {

}


module.exports = ulysses;