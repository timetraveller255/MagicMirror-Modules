/* MagicMirror²
 * Module: monthly calendar
 *
 * Redesigned by Răzvan Cristea
 * for iPad 3 & HD display
 *
 * https://github.com/razvanh255
 * Creative Commons BY-NC-SA 4.0, Romania. 
 *
 * Original MagicMirror² MIT Licensed.
 */

Module.register("monthly", {

    defaults: {
        startMonth: 0,
        monthCount: 2,
        monthsVertical: true,
        repeatWeekdaysVertical: true,
        weekNumbers: true,
        highlightWeekend: true,
        showPastFuture: true,
        fade: false,
        fadePoint: 0.25
    },

    getStyles: function () {
        return ["monthly.css"];
    },

    getScripts: function () {
        return [
                //  "moment.js"
                ];
    },

    start: function () {
        Log.info("Starting module: " + this.name);
        moment.locale(config.locale);
        this.scheduleUpdate();
    },

    scheduleUpdate: function () {
        const now = moment();
        const nextUpdate = now.clone().add(1, "days").startOf("d");
        const delay = nextUpdate.diff(now);

        setTimeout(() => {
            this.updateDom(config.animation);
            this.scheduleUpdate();
        }, delay);
    },

    notificationReceived: function (notification, payload, sender) {
        if (notification === "MIDNIGHT_NOTIFICATION") {
            this.updateDom();
        }
    },

    getDom: function () {
        const wrapper = document.createElement("div");
        const lastMonth = this.config.startMonth + this.config.monthCount - 1;
        const weekdaysHeader = this.createWeekdaysHeader();
        let output = this.config.monthsVertical ? "<div class='multimonth calendar-vertical'>" : "<div class='multimonth calendar-horizontal'>";

        for (let currentMonth = this.config.startMonth; currentMonth <= lastMonth; currentMonth++) {
            output += this.createMonthHtml(currentMonth, weekdaysHeader);
        }

        output += "</div>"; // end of calendar
        wrapper.innerHTML = output;
        return wrapper;
    },

    createWeekdaysHeader: function () {
        const weekdays = moment.weekdaysShort(true);
        let header = "<div class='days-header'>";
        if (this.config.weekNumbers) {
            header += "<div class='day-header dimmed'>" + this.translate("WEEK!") + "</div>";
        }
        for (const day of weekdays) {
            header += `<div class='day-header bright'>${day}</div>`;
        }
        header += "</div>";
        return header;
    },

    createMonthHtml: function (currentMonth, weekdaysHeader) {
        const monthTitle = moment().add(currentMonth, "M").format("MMMM YYYY");
        let monthHtml = this.config.fade ? "<div class='month fade'>" : "<div class='month bright'>";
        monthHtml += `<div class='month-header'><i class="fa fa-calendar"></i> &nbsp;${monthTitle}</div>`;
        if (!this.config.monthsVertical || (this.config.repeatWeekdaysVertical || currentMonth === this.config.startMonth)) {
            monthHtml += weekdaysHeader;
        }

        const firstDayOfMonth = moment().add(currentMonth, "M").startOf("M");
        const lastWeekday = moment().add(currentMonth, "M").endOf("M").endOf("W");
        let currentWeekday = firstDayOfMonth.clone().startOf("W");

        do {
            monthHtml += "<div class='week'>";
            if (this.config.weekNumbers) {
                monthHtml += `<div class='weeknumber'>${currentWeekday.format("W")}</div>`;
            }
            for (let dow = 0; dow < 7; dow++) {
                monthHtml += this.createDayHtml(currentWeekday, firstDayOfMonth);
                currentWeekday.add(1, "d");
            }
            monthHtml += "</div>"; // end of week
        } while (currentWeekday.isSameOrBefore(lastWeekday, "d"));

        monthHtml += "</div>"; // end of month
        return monthHtml;
    },

    createDayHtml: function (currentDay, firstDayOfMonth) {
        let dayHtml = "";

        if (currentDay.isSame(firstDayOfMonth, "M")) {
            if (currentDay.isSame(moment(), "d")) {
                dayHtml = this.config.highlightWeekend && (currentDay.day() === 0 || currentDay.day() === 6)
                    ? `<div class='current_day_weekend'>${currentDay.format("D")}</div>`
                    : `<div class='current_day'>${currentDay.format("D")}</div>`;
            } else {
                dayHtml = this.createNonCurrentDayHtml(currentDay);
            }
        } else {
            dayHtml = this.config.showPastFuture
                ? `<div class='daydim'>${currentDay.format("D")}</div>`
                : "<div class='daydim'>&nbsp;</div>";
        }
        return dayHtml;
    },

    createNonCurrentDayHtml: function (currentDay) {
        return this.config.highlightWeekend && (currentDay.day() === 0 || currentDay.day() === 6)
            ? `<div class='weekend blue'>${currentDay.format("D")}</div>`
            : `<div class='day bright'>${currentDay.format("D")}</div>`;
    }
});
