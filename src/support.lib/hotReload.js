const hotReload = function(chokidar) {
    this.chokidar = chokidar;
    this.debounce = null;
};

hotReload.prototype.attemptLaunch = function(cb, onFail) {
    try {
        var res = cb();
        if (res && res.then) {
            res.catch((err) => {
                console.log(err);
                this.pauseBeforeAttempt(cb, onFail, err);
            });
        }
    } catch(err) {
        console.error(err);
        this.pauseBeforeAttempt(cb, onFail, err);
    }
};

hotReload.prototype.pauseBeforeAttempt = function(cb, onFail) {
    console.error('Issue with starting service, attempting to restart in 500ms...');
    setTimeout(() => {
        onFail();
        this.attemptLaunch(cb, onFail);
    }, 500);
};

hotReload.prototype.watch = function(dir, cb, onFail) {
    //setup our unhandled rejection handler
    process.on('unhandledRejection', (err) => {
        console.error(err);
        this.pauseBeforeAttempt(cb, onFail, err);
    });

    this.chokidar.watch(dir).on('all', () => {
        clearTimeout(this.debounce);
        this.debounce = setTimeout(() => {
            this.attemptLaunch(cb, onFail);
        }, 1000);
    });
};

module.exports = function(chokidar) {
    if (!chokidar) {
        chokidar = require('chokidar');
    }

    return new hotReload(chokidar);
};