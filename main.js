var cluster = require('cluster');
var os = require('os');

function ulysses(opts) {
    if(!opts) {
        opts = {};
    }
    if(!opts.exec) {
        throw new Error("Worker must be specified");
    }
    this.started = false;
    this.exec = opts.exec;
    this.workers = {};
    this.args = opts.args || [];
    this.silent = opts.silent || true;
    this.numOfWorkers = opts.workerNum || os.cpus().length;
    this.env = opts.env || {};
    cluster.setupMaster({
        exec: this.exec,
        args: this.args,
        silent: this.silent
    });
}

ulysses.prototype.start = function(callback) {
    var self = this;
    if(this.started) {
        callback(null, false);
        return;
    }
    process.nextTick(function() {
        i = 0;
        while(i < self.numOfWorkers) {
            worker = cluster.fork();
            this.workers[worker.id] = worker;
            this.bind(worker.id);
            i++;
        }
        callback(null, true);
        self.started = true;
    });
}

ulysses.prototype.stop = function() {
    var self = this;
    process.nextTick(function() {
        for(var i in self.workers) {
            self.workers[i].send('shutdown');
            self.workers[i].timeout = setTimeout(self._timeout, 5000, i);
        }
    });
}

ulysses.prototype.restart = function() {

}

ulysses.prototype.reload = function() {

}

ulysses.prototype.bind = function(id) {
    worker = this.workers[id];
    worker.on('disconnect', this._disconnect.bind({id: id}));
    worker.on('exit', this._exit.bind({id: id}));
    worker.on('online', this._online.bind({id: id}));
    worker.on('message', this._message.bind({id: id}));
    worker.on('listening', this._listening.bind({id: id}));
    worker.on('error', this._error.bind({id: id}))
}

ulysses.prototype._error = function(err) {

}

ulysses.prototype._exit = function(code, signal) {

}

ulysses.prototype._listening = function(address) {

}

ulysses.prototype._online = function() {

}

ulysses.prototype._message = function(message) {

}

ulysses.prototype._disconnect = function() {

}

ulysses.prototype._fork = function(worker) {

}

ulysses.prototype._timeout = function(id) {
    this.workers[id].disconnect();
}


module.exports = ulysses;