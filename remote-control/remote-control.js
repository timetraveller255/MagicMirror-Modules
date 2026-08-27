/*
 * Remote control and dimmer
 * Copyright 2026, Razvan Cristea. All rights reserved.
 */
Module.register("remote-control",{
    defaults: {
        requiresVersion:"2.30.0",
        startHour: 23,
        endHour: 7,
        dimmedBrightness: 0.5,
        normalBrightness: 1.0,
        fadeDuration: 50,
        update: 60000
    },

    start(){
        Log.info(`[${this.name}] Remote Control and dimmer started`);
        this.updateBrightness();
        setInterval(() => {
            this.updateBrightness();
        }, this.config.update);
    },

    updateBrightness: function() {
        const now = new Date();
        const currentHour = now.getHours();

        let isDimmed = false;

        if (this.config.startHour > this.config.endHour) {
            // Interval peste miezul nopții (ex: 22:00 - 07:00)
            isDimmed = currentHour >= this.config.startHour || currentHour < this.config.endHour;
        } else {
            // Interval în interiorul aceleiași zile (ex: 13:00 - 17:00)
            isDimmed = currentHour >= this.config.startHour && currentHour < this.config.endHour;
        }

        const targetBrightness = isDimmed ? this.config.dimmedBrightness : this.config.normalBrightness;
        
        // Aplică durata de tranziție setată în configurație și schimba luminozitatea
        document.body.style.transition = `filter ${this.config.fadeDuration}s ease-in-out`;
        document.body.style.filter = `brightness(${targetBrightness})`;
    }
});