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
Module.register("webcam", {
  defaults: {
    headerText: "Live feed",
    streamUrl: "http://192.168.68.101:8085/?action=stream",
    width: "480px",
    height: "360px",
    mirror: false,
    motionDetectionEnabled: false,
    enableRecording: false,
    testMode: false
  },

  getStyles: function () {
    return ["webcam.css"];
  },

  getDom: function () {
    const wrapper = document.createElement("div");
    wrapper.className = "webcam-container";

    if (this.config.headerText) {
      const header = document.createElement("div");
      header.className = "webcam-header";
      header.innerHTML = this.config.headerText;
      wrapper.appendChild(header);
    }

    const videoFrame = document.createElement("div");
    videoFrame.className = "webcam-frame";
    videoFrame.style.width = this.config.width;
    videoFrame.style.height = this.config.height;

    const img = document.createElement("img");
    img.src = this.config.streamUrl;
    img.className = "webcam-stream";
    if (this.config.mirror) {
      img.classList.add("mirrored");
    }

    videoFrame.appendChild(img);
    wrapper.appendChild(videoFrame);

    return wrapper;
  },

  start: function () {
    Log.info("Starting module: " + this.name);
    this.sendSocketNotification("START_STREAM", {});

    // Trimite notificarea de înregistrare doar dacă opțiunea este activă
    if (this.config.enableRecording) {
      this.sendSocketNotification("START_DETECTION", {});
    } else {
      this.sendSocketNotification("STOP_DETECTION", {});
    }

    if (this.config.motionDetectionEnabled) {
      this.initMotionDetection();
    }
  },

  notificationReceived: function (notification, payload, sender) {
    if (notification === "DOM_OBJECTS_CREATED" && this.onDomCreated) {
      this.onDomCreated();
    }
  },

  socketNotificationReceived: function (notification, payload) {
    if (notification === "MOTION_DETECTED" && this.onMotionDetected) {
      this.onMotionDetected(payload);
    }
  },

  suspend: function () {
    this.sendSocketNotification("STOP_STREAM", {});
    this.sendSocketNotification("STOP_DETECTION", {});
  },

  resume: function () {
    this.sendSocketNotification("START_STREAM", {});
    if (this.config.enableRecording) {
      this.sendSocketNotification("START_DETECTION", {});
    }
  },

  initMotionDetection: function () {
    Log.info("[webcam] Modulul de detecție mișcare a fost inițializat.");
    const self = this;

    this.onDomCreated = function () {
      self.hide(0, { lockString: self.identifier });
    };

    this.onMotionDetected = function (isMotion) {
      if (self.config.testMode) {
        if (isMotion === true) {
          self.show(500, { lockString: self.identifier });
        } else {
          self.hide(500, { lockString: self.identifier });
        }
      }
    };
  }
});