Module.register("multimonth", {
    // Default module config.
    defaults: {
        startMonth: 0,
        monthCount: 1,
        monthsVertical: true,
        repeatWeekdaysVertical: true,
        weekNumbers: true,
        weekNumbersISO: true,
        highlightWeekend: true,
        headerType: 'short',
        otherMonths: true,
        startWeek: 1,
        weekend1: 6,
        weekend2: 0,
        eventsOn: true,
        calNames: [],
        instanceID: "",
        icon: '<i class="fa fa-calendar blue"></i> &nbsp;',
        bigCalendar: false,
    },

    getStyles: function () {
        return ["multimonth.css"];
    },

    start: function () {
        Log.info("Starting module: " + this.name);
        this.storedEvents = [];
        this.midnightTimer = null;
        this.scheduleMidnightUpdate();
    },

    scheduleMidnightUpdate: function () {
        if (this.midnightTimer) {
            clearTimeout(this.midnightTimer);
        }

        const now = new Date();
        const nextMidnight = new Date(now);
        nextMidnight.setHours(24, 0, 0, 0);

        const timeUntilMidnight = nextMidnight - now;

        this.midnightTimer = setTimeout(() => {
            this.updateDom();
            this.scheduleMidnightUpdate();
        }, timeUntilMidnight);
    },

    notificationReceived: function (notification, payload) {
        if (notification === 'CALENDAR_EVENTS') {
            this.storedEvents = JSON.parse(JSON.stringify(payload));
            this.updateDom();
        }
    },

    getDom: function () {
        const firstDay = (dateObject, index) => {
            const dayOfWeek = dateObject.getDay();
            const res = new Date(dateObject);
            const diff = (dayOfWeek - index + 7) % 7;
            res.setDate(dateObject.getDate() - diff);
            res.setHours(0, 0, 0, 0);
            return res;
        };

        const lastDay = (dateObject, index) => {
            const dayOfWeek = dateObject.getDay();
            const res = new Date(dateObject);
            const diff = (index - dayOfWeek + 7) % 7;
            res.setDate(dateObject.getDate() + diff);
            res.setHours(0, 0, 0, 0);
            return res;
        };

        const weekNames = (dateObject, index) => {
            let sDate = firstDay(dateObject, 0);
            let weekdaysTemp = [];
            let weekdaysHeader = "";
            for (let tday = 0; tday < 7; tday++) {
                weekdaysTemp.push(sDate.toLocaleDateString(config.language, { weekday: this.config.headerType }));
                sDate.setDate(sDate.getDate() + 1);
            }
            for (let tday = 0; tday < 7; tday++) {
                let offset = (tday + index) % 7;
                weekdaysHeader += `<div class='dow ${this.config.instanceID} ${weekdaysTemp[offset]}'> ${weekdaysTemp[offset]} </div>`;
            }
            return weekdaysHeader;
        };

        const weekNumber = (dateObject) => {
            const target = new Date(dateObject);
            const jan1 = new Date(target.getFullYear(), 0, 1);
            const daysDiff = Math.floor((target - jan1) / 86400000);
            return Math.ceil((daysDiff + jan1.getDay() + 1) / 7);
        };

        const weekNumberISO = (dateObject) => {
            const date = new Date(dateObject);
            date.setHours(0, 0, 0, 0);
            const day = date.getDay() || 7;
            date.setDate(date.getDate() + 4 - day);
            const yearStart = new Date(date.getFullYear(), 0, 1);
            return Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
        };

        const matchName = (cn) => {
            if (this.config.calNames.length === 0) return true;
            return this.config.calNames.includes(cn);
        };

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const year = today.getFullYear();
        const month = today.getMonth();
        const wrapper = document.createElement("div");
        const lastMonth = this.config.startMonth + this.config.monthCount - 1;

        let weekdaysHeader = `<div class='dowContainer ${this.config.instanceID}'>`;
        if (this.config.weekNumbers && !this.config.bigCalendar) {
            weekdaysHeader += `<div class='dowBlank ${this.config.instanceID}'>${this.translate("WEEK!")} &nbsp;</div>`;
        }
        weekdaysHeader += weekNames(today, this.config.startWeek);
        weekdaysHeader += "</div>";

        let output = `<div class='calendar settings ${this.config.instanceID} ${this.config.monthsVertical ? "vertical" : "horizontal"}'>`;

        for (let currentMonth = this.config.startMonth; currentMonth <= lastMonth; currentMonth++) {
            output += `<div class='month ${this.config.instanceID}'>`;

            const titleTemp = new Date(year, month + currentMonth, 1);
            const monthTitle = titleTemp.toLocaleString(config.language, { month: 'long', year: 'numeric' });
            output += `<div class='month-header ${this.config.instanceID}'>` + this.config.icon + monthTitle + "</div>";

            if (!this.config.monthsVertical || this.config.repeatWeekdaysVertical || currentMonth === this.config.startMonth) {
                output += weekdaysHeader;
            }

            const firstDayOfMonth = new Date(year, month + currentMonth, 1, 0, 0, 0, 0);
            const lastDayOfMonth = new Date(year, month + currentMonth + 1, 0, 0, 0, 0, 0);
            
            let gridDay = firstDay(firstDayOfMonth, this.config.startWeek);
            const gridEnd = lastDay(lastDayOfMonth, (this.config.startWeek + 6) % 7);

            while (gridDay <= gridEnd) {
                output += `<div class='weekContainer ${this.config.instanceID}'>`;

                const weekNum = this.config.weekNumbersISO ? weekNumberISO(gridDay) : weekNumber(gridDay);
                const weekNumResultSmall = `<div class='weekNumSmall w${weekNum} ${this.config.instanceID}'>${weekNum}</div>`;
                const weekNumResultBig = `<div class='weekNumBig w${weekNum} ${this.config.instanceID}'>Wk ${weekNum}</div>`;

                if (this.config.weekNumbers && !this.config.bigCalendar) {
                    output += weekNumResultSmall;
                }

                for (let dow = 0; dow <= 6; dow++) {
                    output += `<div class='dayContainer ${this.config.instanceID}'>`;

                    if (dow === 0 && this.config.weekNumbers && this.config.bigCalendar) {
                        output += weekNumResultBig;
                    }

                    output += "<div class='day ";

                    const isSameMonth = gridDay.getMonth() === firstDayOfMonth.getMonth();
                    const currentGridTime = new Date(gridDay).setHours(0, 0, 0, 0);

                    if (isSameMonth) {
                        output += "thismonth " + this.config.instanceID;
                        if (currentGridTime === today.getTime()) {
                            output += " today";
                        }
                        if (this.config.highlightWeekend && (gridDay.getDay() === this.config.weekend1 || gridDay.getDay() === this.config.weekend2)) {
                            output += " weekend";
                        }
                    } else {
                        output += (this.config.otherMonths ? "dim " : "noDisplay ") + this.config.instanceID;
                    }

                    output += ` ${gridDay.getMonth() + 1}-${gridDay.getDate()}'>${gridDay.getDate()}</div>`;
                    output += "<div class='events'>";

                    if (isSameMonth) {
                        const eventCounts = {};

                        for (let ev = 0; ev < this.storedEvents.length; ev++) {
                            const e = this.storedEvents[ev];
                            const match = matchName(e.calendarName);
                            const eventDate = new Date(Number(e.startDate)).setHours(0, 0, 0, 0);

                            if (eventDate === currentGridTime && this.config.eventsOn && match) {
                                if (eventCounts[e.calendarName]) {
                                    eventCounts[e.calendarName].count++;
                                } else {
                                    eventCounts[e.calendarName] = { count: 1, symbol: e.symbol, color: e.color };
                                }
                            }
                        }

                        if (this.config.bigCalendar) {
                            output += "<div class='bigEvent'>";
                            for (const calName in eventCounts) {
                                output += `<span style='color: ${eventCounts[calName].color};'> ${eventCounts[calName].count} x <i class="icon ${eventCounts[calName].symbol}"></i></span>`;
                            }
                            output += "</div>";
                        } else {
                            for (const calName in eventCounts) {
                                output += `<span class='event' style='border-color: ${eventCounts[calName].color};'></span>`;
                            }
                        }
                    } else {
                        output += `<div class='noDisplay ${this.config.instanceID}'></div>`;
                    }

                    output += "</div></div>"; // Închidere events + dayContainer
                    gridDay.setDate(gridDay.getDate() + 1);
                }

                output += "</div>"; // Închidere weekContainer
            }
            output += "</div>"; // Închidere month
        }
        output += "</div>"; // Închidere calendar

        wrapper.innerHTML = output;
        return wrapper;
    }
});