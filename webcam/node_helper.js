/* MagicMirror²
 * Module: Webcam live feed
 *
 * Redesigned by Răzvan Cristea
 *
 * https://github.com/razvanh255
 * Creative Commons BY-NC-SA 4.0, Romania. 
 *
 * Original MagicMirror² MIT Licensed.
 */
const NodeHelper = require("node_helper");
const { spawn, exec } = require("child_process");
const path = require("path");
const fs = require("fs");

module.exports = NodeHelper.create({
    pythonProcess: null,
    cleanupInterval: null,
    maxAgeDays: 7, 

    start: function() {
        console.log("[webcam] Node helper pornit.");
        
        this.cleanOldRecordings();
        
        const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
        this.cleanupInterval = setInterval(() => {
            this.cleanOldRecordings();
        }, TWENTY_FOUR_HOURS);
    },

    stop: function() {
        this.stopRecording();
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
        }
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "START_DETECTION" || notification === "START_STREAM") {
            this.startStreamAndRecording();
        } else if (notification === "STOP_DETECTION" || notification === "STOP_STREAM") {
            this.stopRecording();
        }
    },

    startStreamAndRecording: function() {
        if (this.pythonProcess) return;

        const shPath = path.resolve(__dirname, "../../webcam.sh"); 

        exec(`bash ${shPath}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`[webcam Error] Nu s-a putut rula webcam.sh: ${error}`);
                return;
            }
            console.log(`[webcam] mjpg-streamer inițializat prin webcam.sh.`);

            const scriptPath = path.resolve(__dirname, "recorder.py");
            this.pythonProcess = spawn("python3", [scriptPath]);

            this.pythonProcess.stdout.on("data", (data) => {
                const message = data.toString().trim();
                
                if (message.includes("MOTION_STARTED")) {
                    this.sendSocketNotification("MOTION_DETECTED", true);
                } else if (message.includes("MOTION_STOPPED")) {
                    this.sendSocketNotification("MOTION_DETECTED", false);
                }
            });

            this.pythonProcess.stderr.on("data", (data) => {
                console.error(`[webcam Python Error]: ${data}`);
            });

            console.log("[webcam] Detectorul Python a fost lansat.");
        });
    },

    stopRecording: function() {
        if (this.pythonProcess) {
            this.pythonProcess.kill("SIGINT");
            this.pythonProcess = null;
            console.log("[webcam] Detectorul Python a fost oprit.");
        }
    },

    cleanOldRecordings: function() {
        const dirPath = path.resolve(__dirname, "recordings");

        if (!fs.existsSync(dirPath)) return;

        const now = Date.now();
        const maxAgeMs = this.maxAgeDays * 24 * 60 * 60 * 1000;

        fs.readdir(dirPath, (err, files) => {
            if (err) return;

            files.forEach((file) => {
                const filePath = path.join(dirPath, file);
                if (path.extname(file).toLowerCase() === ".mp4") {
                    fs.stat(filePath, (errStat, stats) => {
                        if (errStat) return;
                        if (now - stats.mtimeMs > maxAgeMs) {
                            fs.unlink(filePath, () => {
                                console.log(`[webcam] Șters automat videoclip vechi: ${file}`);
                            });
                        }
                    });
                }
            });
        });
    }
});