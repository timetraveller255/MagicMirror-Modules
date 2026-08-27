/* 
* https://github.com/razvanh255 
* Experimental Module
*/

Module.register("smartNotification", {
    defaults: {
        showStatus: true,
        dynamicBackground: false,
        dimInterval: 10,
        dimLevel: 0.5,
        dimStart: "00:00",
        dimEnd: "07:00",
        rotation: false,
        format: 16/9,
        sharpMode: false,
        hideModulesTime: "00:00",
        showModulesTime: "00:00",
        reload: true,
        reloadTime: 59 * 60 * 1000,
        modulesToHide: [],
        notifications: [
            {
                month: 13, // under development
                day: 25,
                startHour: 8,
                endHour: 23,
                titles: [
                    '<i class="fa-solid fa-gift mooncolor"></i> Crăciun fericit!', 
                    '<i class="fa-solid fa-gifts mooncolor"></i> Sărbători fericite!'],
                messages: ["Multă sănătate și multe bucurii!"]
            }
        ]
    },

    getTranslations: function () {
        return {
            en: "en.json",
            ro: "ro.json"
        };
    },

    start: function () {
        Log.info("Starting module: " + this.name);
        document.body.style.opacity = 0;
        this.isOnline = navigator.onLine;
    //  this.scheduleNotifications();
    //  this.scheduleHourlyNotifications();
    //  this.checkTimeNotification();
    //  this.dynamicBackground();
        this.scheduleBrightness();
    //  this.scheduleHideModules();
    //  this.scheduleShowModules();
        this.checkOnlineStatus();
        this.adjustZoom();
        this.reloadPage();
        window.addEventListener("resize", this.adjustZoom.bind(this));
        window.addEventListener('mousemove', this.showCursor.bind(this));
        window.removeEventListener('click', this.showCursor.bind(this));
        var self = this;
        setTimeout(function() {
            document.body.style.transition = "opacity 10s ease-in-out";
            document.body.style.opacity = 1;
            if (self.config.rotation) {
                self.rotatePage();
            }
        }, 1000);
    },

    getStyles: function () {
        return [
                //  "fontawesome.css"
                ];
    },

    showCursor: function () {
        var html = document.querySelector("html");
        html.style.cursor = "auto";
        setTimeout(function() {
            html.style.cursor = "none";
        }, 10000);
    },

    scheduleNotifications: function () {
        const probability = 0.002; // Probabilitate

        const checkNotifications = () => {
            const now = new Date();
            const currentMonth = now.getMonth() + 1;
            const currentDay = now.getDate();
            const currentHour = now.getHours();
            const currentMinute = now.getMinutes();

            this.config.notifications.forEach(notification => {
                if (notification.month !== null && notification.day !== null) {
                    if (notification.month === currentMonth && notification.day === currentDay) {
                        if (currentHour >= notification.startHour && currentHour < notification.endHour) {
                            if (Math.random() < probability) {
                                let randomMessage = this.getRandomMessage(notification.messages);
                                let randomTitle = this.getRandomTitle(notification.titles);
                                this.sendNotification("SHOW_ALERT", {
                                    type: "notification",
                                    title: randomTitle,
                                    message: randomMessage,
                                    timer: 8000
                                });
                            }
                        }
                    }
                } else {
                    if (currentHour === notification.startHour) {
                        if (Math.random() < probability) {
                            let randomMessage = this.getRandomMessage(notification.messages);
                            let randomTitle = this.getRandomTitle(notification.titles);
                            this.sendNotification("SHOW_ALERT", {
                                type: "notification",
                                title: randomTitle,
                                message: randomMessage,
                                timer: 8000
                            });
                        }
                    }
                }
            });
        };

        checkNotifications();
        setInterval(checkNotifications, 1000);
    },

    getRandomMessage: function (messages) {
        const randomIndex = Math.floor(Math.random() * messages.length);
        return messages[randomIndex];
    },

    getRandomTitle: function (titles) {
        const randomIndex = Math.floor(Math.random() * titles.length);
        return titles[randomIndex];
    },

    scheduleHourlyNotifications: function () {
        setInterval(() => {
            const now = new Date();
            if (now.getMinutes() === 62 && now.getSeconds() === 62) { // under development
                this.sendNotification("HIDE_ALERT");
                this.sendNotification("SHOW_ALERT", {
                    type: "notification",
                    title: "<i class='fa-regular fa-clock gold'></i> Ora exactă",
                    message: "Este ora: " + now.getHours() + ":00",
                    timer: 5000
                });
            }
        }, 1000);
    },

    checkTimeNotification: function() {
        if (this.config.sharpMode) {
            setInterval(() => {
                var now = new Date();
                var currentTime = now.toTimeString().split(" ")[0];
                var sharp = this.translate("Time it was ") + currentTime;
                var bell = "<i class=\"fas fa-bell green\"></i> ";
                var gift = "<i class=\"fas fa-gift orange\"></i> ";
                var glas = "<i class=\"fas fa-glass-cheers gold\"></i> ";
                var hart = "<i class=\"fas fa-heart orangered\"></i> ";
                var cake = "<i class=\"fas fa-birthday-cake mooncolor\"></i> ";

                var timeIntervals = [
                    { hours: ["23:00:00", "00:06:00", "01:00:00"], message: this.translate("Good night!") },
                    { hours: ["02:00:00", "03:00:00", "04:00:00"], message: this.translate("Sleep well!") },
                    { hours: ["05:00:00", "06:00:00", "07:00:00", "08:00:00", "09:00:00", "10:00:00", "11:00:00"], message: this.translate("Good morning!") },
                    { hours: ["12:00:00", "13:00:00", "14:00:00"], message: this.translate("Bon appetit!") },
                    { hours: ["15:00:00", "16:00:00", "17:00:00"], message: this.translate("Have a nice day!") },
                    { hours: ["18:00:00", "19:00:00", "20:00:00", "21:00:00", "22:00:00"], message: this.translate("Have a nice evening!") }
                ];

                for (var i = 0; i < timeIntervals.length; i++) {
                    if (timeIntervals[i].hours.includes(currentTime)) {
                        this.sendNotification("SHOW_ALERT", {
                            //imageFA: bell,
                            type: "notification",
                            title: bell + sharp,
                            message: timeIntervals[i].message,
                            timer: 8000
                        });
                        break;
                    }
                }
            }, 1000);
        }
    },

    dynamicBackground: function() {
        if (this.config.dynamicBackground) {
            var below = document.querySelector('.below');
            if (!below) return;
            
            below.style.backgroundImage = "url(" + this.config.dynamicBackground + ")";
            below.style.backgroundSize = "70%";
            below.style.backgroundPosition = "center 40%";
            below.style.backgroundRepeat = "no-repeat";        
        }
    },

    scheduleBrightness: function () {
        var body = document.querySelector("body");
        var dimLevel = this.config.dimLevel;
        var dimStart = this.config.dimStart;
        var dimEnd = this.config.dimEnd;

        setInterval(function () {
            function parseTime(timeString) {
                var parts = timeString.split(":");
                return {
                    hour: parseInt(parts[0], 10),
                    minute: parseInt(parts[1], 10)
                };
            }

            var start = parseTime(dimStart);
            var end = parseTime(dimEnd);

            function isCurrentTimeBetween(start, end) {
                var now = new Date();
                var currentMinutes = now.getHours() * 60 + now.getMinutes();
                var startMinutes = start.hour * 60 + start.minute;
                var endMinutes = end.hour * 60 + end.minute;
                return currentMinutes >= startMinutes && currentMinutes < endMinutes;
            }

            function checkAndChangeOpacity() {
                if (isCurrentTimeBetween(start, end)) {
                    body.style.opacity = dimLevel;
                    const compStyles = window.getComputedStyle(body);
                //    log.info(`Luminozitatea scăzută la: ${compStyles.getPropertyValue("opacity")}%`);
                } else {
                    body.style.opacity = 1;
                }
            }

            checkAndChangeOpacity();
        }, 60 * 1000);
    },

    scheduleHideModules: function () {
        let now = new Date();
        let [hour, minute] = this.config.hideModulesTime.split(":").map(Number);
        let hideModulesAt = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0, 0);

        if (hideModulesAt <= now) {
            hideModulesAt.setDate(now.getDate() + 1);
        }

        let timeToHide = hideModulesAt - now;

        setTimeout(() => {
            this.config.modulesToHide.forEach(moduleName => {
                let modules = MM.getModules().withClass(moduleName);
                modules.forEach(module => module.hide());
            });
            this.scheduleHideModules(); 
        }, timeToHide);
    },

    scheduleShowModules: function () {
        let now = new Date();
        let [hour, minute] = this.config.showModulesTime.split(":").map(Number);
        let showModulesAt = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0, 0);

        if (showModulesAt <= now) {
            showModulesAt.setDate(now.getDate() + 1);
        }

        let timeToShow = showModulesAt - now;

        setTimeout(() => {
            this.config.modulesToHide.forEach(moduleName => {
                let modules = MM.getModules().withClass(moduleName);
                modules.forEach(module => module.show());
            });
            this.scheduleShowModules();
        }, timeToShow);
    },

    adjustZoom: function () {
        let screenWidth = window.innerWidth;
        let screenHeight = window.innerHeight;
        let zoomLevel = 1;

        if (screenWidth >= 1080) {
            zoomLevel = 0.8;
        } else if (screenWidth >= 800) {
            zoomLevel = 0.7;
        } else {
            zoomLevel = 0.6;
        }

        document.body.style.zoom = zoomLevel;
    },

    rotatePage: function () {
        var html = document.querySelector("html");
        var body = document.querySelector("body");
        
        if (this.config.rotation === 90 && this.config.format === 4/3) {
            body.style.transform = "rotate(90deg)";
            body.style.transformOrigin = "bottom right";
            body.style.position = "absolute";
            body.style.bottom = "0";
            body.style.right = "96%";
            body.style.height = "121vw";
            body.style.width = "118vh";
        } else if (this.config.rotation === 90 && this.config.format === 3/4) {
            body.style.transform = "rotate(90deg)";
            body.style.transformOrigin = "bottom right";
            body.style.position = "absolute";
            body.style.bottom = "0";
            body.style.right = "98%";
            body.style.height = "130vw";
            body.style.width = "129vh";
            body.style.zoom = 0.75;
        }
    },

    getDom: function () {
        if (!this.config.showStatus) {
            document.querySelector(".smartNotification").style.visibility = "hidden";
        }
        const wrapper = document.createElement("div");
        
        wrapper.innerHTML = this.isOnline 
            ? "<i class=\"green medium fas fa-wifi\"></i>&nbsp; <span class='slarge bright light'>MagicMirror²</span><br>Platforma modulară este online"
            : "<i class=\"orangered medium fas fa-wifi\"></i>&nbsp; <span class='orangered slarge bright light'>Fără conexiune</span><br>Verifică conexiunea și routerul WiFi";
        
        return wrapper;
    },

    checkOnlineStatus: function () {
        const checkStatus = () => {
            const previousStatus = this.isOnline;
            this.isOnline = navigator.onLine;
            
            if (previousStatus !== this.isOnline) {
                if (!this.config.showStatus) {
                    this.sendNotification("SHOW_ALERT", {
                    type: "notification",
                    title: "<i class=\"orangered medium fas fa-wifi\"></i>&nbsp; <span class='orangered slarge bright light'>Fără conexiune</span>",
                    message: "Verifică conexiunea și routerul WiFi",
                    timer: 10000
                    });
                } else this.updateDom();
            }
        };

        checkStatus();
        setInterval(checkStatus, 1000);
    },

    reloadPage: function () {
        if (this.config.reload) {
            setTimeout(() => {
               location.reload();
            }, this.config.reloadTime);
        }
    }
});
