Module.register("watchdog",{

    // Default module config.
    defaults: {
        interval: 2000,
        timeout: 1000
    },

    // Override dom generator.
    start: function() {
        Log.info("Starting module: " + this.name);
        this.scheduleRestart();
        this.startHeartbeat();
    },

    // Start the interval to send the PING message.
    startHeartbeat: function() {
        var self = this;
        setInterval(function() {
            self.scheduleRestart();
        }, this.config.interval);
    },

    // Reschedule restart by clearing old timer, and setting a new timer.
    scheduleRestart: function() {
        clearTimeout(this.timer);
        this.timer = setTimeout(this.restart, this.config.timeout);
    },

    // Quit Node process.
    restart: function() {
        var now = new Date();
        console.info('WatchDog: Heartbeat timeout. Frontend might have crashed. Exit now.');
    //  process.exit(1);
    }
});
