const NodeHelper = require("node_helper");
const { exec } = require("child_process");
const os = require("os");
const fs = require("fs");

module.exports = NodeHelper.create({
    start: function() {
        console.log("Starting node_helper for: " + this.name);
        this.lastIdle = 0;
        this.lastTotal = 0;
    },

    socketNotificationReceived: function(notification) {
        if (notification === "GET_CPU_USAGE") {
            this.getCpuUsage();
        }
        if (notification === "GET_CPU_TEMP") {
            this.getCpuTemp();
        }
        if (notification === "GET_RAM_USAGE") {
            this.getRamUsage();
        }
        if (notification === "GET_DISK_USAGE") {
            this.getDiskUsage();
        }
    },

    // Function to calculate overall CPU usage from /proc/stat
    getCpuUsage: function() {
    //    console.log("Fetching CPU usage...");
        fs.readFile('/proc/stat', 'utf8', (err, data) => {
            if (err) {
            //  console.error("Error reading /proc/stat:", err);
                this.sendSocketNotification("ERROR_READING", { err });
                return;
            }

            const cpuData = data.split('\n')[0].replace(/ +/g, ' ').split(' ');
            const idle = parseInt(cpuData[4]);
            const total = cpuData.slice(1, 8).reduce((acc, val) => acc + parseInt(val), 0);

            const idleDiff = idle - this.lastIdle;
            const totalDiff = total - this.lastTotal;

            const cpuUsage = Math.round(100 * (1 - idleDiff / totalDiff));

            this.lastIdle = idle;
            this.lastTotal = total;

            this.sendSocketNotification("CPU_USAGE", { cpuUsage });
        //  console.log("CPU usage fetched successfully.");
        });
    },

    // Function to get CPU temperature and RAM usage
    getCpuTemp: function() {
    //    console.log("Fetching CPU temperature...");
        fs.readFile('/sys/class/thermal/thermal_zone0/temp', 'utf8', (err, data) => {
            if (err) {
            //  console.error("Error reading CPU temperature:", err);
                this.sendSocketNotification("CPU_TEMP", { cpuTemp: "0", cpuTempF: "0" });
            } else {
                const tempC = parseFloat(data) / 1000; // Convert millidegree to degree Celsius
                const tempF = (tempC * 9/5) + 32;      // Convert Celsius to Fahrenheit
                if (isNaN(tempC)) {
                //  console.error("Error parsing CPU temperature.");
                    this.sendSocketNotification("CPU_TEMP", { cpuTemp: "0", cpuTempF: "0" });
                } else {
                    this.sendSocketNotification("CPU_TEMP", {
                        cpuTemp: tempC.toFixed(1),
                        cpuTempF: tempF.toFixed(1)
                    });
            //  console.log("CPU temperature fetched successfully.");
                }
            }
        });
    },

    // Function to calculate RAM usage
    getRamUsage: function() {
    //    console.log("Fetching RAM usage...");
        const totalRamBytes = os.totalmem();
        const freeRamBytes = os.freemem();

        // Calculate Used RAM (Total - Free) and convert to MB
        const totalRamMB = (totalRamBytes) / (1024 * 1024);
        const freeRamMB = freeRamBytes / (1024 * 1024);
        const usedRamMB = (totalRamBytes - freeRamBytes) / (1024 * 1024);

        this.sendSocketNotification("RAM_USAGE", {
            usedRam: usedRamMB.toFixed(0),
            freeRam: freeRamMB.toFixed(0),
            totalRam: totalRamMB.toFixed(0)
        });
    //    console.log("RAM usage fetched successfully.");
    },

    // Function to get Disk Usage using the "df" command
    getDiskUsage: function() {
    //    console.log("Fetching Disk usage...");
        exec("df -h --output=source,size,avail,target /", (err, stdout, stderr) => {
            if (err) {
            //  console.error("Error fetching disk usage:", err);
                return;
            }

            const lines = stdout.trim().split('\n');
            if (lines.length >= 2) {
                const diskInfo = lines[1].replace(/ +/g, ' ').split(' ');
                const driveCapacity = diskInfo[1].replace("G", "GB");  // Fix to show "GB"
                const freeSpace = diskInfo[2].replace("G", "GB");      // Fix to show "GB"
                const usedSpace = driveCapacity - freeSpace;

                this.sendSocketNotification("DISK_USAGE", {
                    driveCapacity: driveCapacity,
                    freeSpace: freeSpace,
                    usedSpace: usedSpace
                });
        //  console.log("Disk usage fetched successfully.");
            }
        });
    }
});
