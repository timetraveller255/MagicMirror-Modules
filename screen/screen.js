Module.register("screen", {
  defaults: {
    rules: [
      {
        minWidth: 0,
        maxWidth: 768,
        hideModules: ["desktop"],
        showModules: ["laptop"]
      }
    ],
    checkInterval: 1000
  },

  start: function () {
    Log.info(`Starting module: ${this.name}`);
    this.applyResponsiveRules();

    window.addEventListener("resize", () => {
      this.applyResponsiveRules();
    });

    setInterval(() => {
      this.applyResponsiveRules();
    }, this.config.checkInterval);
  },

  applyResponsiveRules: function () {
    const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    const height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

    this.config.rules.forEach((rule) => {
      const matchWidth =
        (rule.minWidth === undefined || width >= rule.minWidth) &&
        (rule.maxWidth === undefined || width <= rule.maxWidth);

      const matchHeight =
        (rule.minHeight === undefined || height >= rule.minHeight) &&
        (rule.maxHeight === undefined || height <= rule.maxHeight);

      // Dacă dimensiunea curentă se încadrează în regulă
      if (matchWidth && matchHeight) {
        // Ascunde modulele specificate
        if (rule.hideModules && Array.isArray(rule.hideModules)) {
          rule.hideModules.forEach((moduleName) => {
            MM.getModules().withClass(moduleName).enumerate((module) => {
              module.hide(1000, { lockString: "screen" });
            });
          });
        }

        // Afișează modulele specificate
        if (rule.showModules && Array.isArray(rule.showModules)) {
          rule.showModules.forEach((moduleName) => {
            MM.getModules().withClass(moduleName).enumerate((module) => {
              module.show(1000, { lockString: "screen" });
            });
          });
        }
      }
    });
  }
});