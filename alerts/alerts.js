Module.register("alerts", {
  defaults: {
    // Alerte la ore fixe (HH:MM)
    fixedTimeAlerts: [
      { time: "07:00", title: "Bună dimineața!", message: "Să ai o zi excelentă!", timer: 10000, type: "notification" },
      { time: "23:00", title: "Noapte bună", message: "Este timpul să visezi frumos.", timer: 10000, type: "notification" }
    ],
    // Alerte repetitive la un anumit interval de minute
    intervalAlerts: [
      { intervalMinutes: 60, title: "Hidratare", message: "Bea un pahar cu apă!", timer: 8000, type: "notification" }
    ]
  },

  start: function () {
    Log.info(`Starting module: ${this.name}`);
    this.lastTriggered = {};
    this.scheduleFixedAlerts();
    this.scheduleIntervalAlerts();
  },

  // Verifică alertele la oră fixă în fiecare secundă
  scheduleFixedAlerts: function () {
    setInterval(() => {
      const now = new Date();
      const currentHHMM = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      const seconds = now.getSeconds();

      // Rulăm verificarea la secunda 0
      if (seconds === 0) {
        this.config.fixedTimeAlerts.forEach((alert) => {
          if (alert.time === currentHHMM) {
            this.triggerAlert(alert);
          }
        });
      }
    }, 1000);
  },

  // Setează temporizatoare pentru alertele la intervale
  scheduleIntervalAlerts: function () {
    this.config.intervalAlerts.forEach((alert) => {
      const ms = alert.intervalMinutes * 60 * 1000;
      setInterval(() => {
        this.triggerAlert(alert);
      }, ms);
    });
  },

  // Trimite notificarea către modulul nativ 'alert' din MagicMirror
  triggerAlert: function (alertData) {
    this.sendNotification("SHOW_ALERT", {
      type: alertData.type || "notification", // 'notification' (banner jos) sau 'alert' (modal centru)
      title: alertData.title || "Alertă",
      message: alertData.message,
      timer: alertData.timer || 8000
    });
  }
});