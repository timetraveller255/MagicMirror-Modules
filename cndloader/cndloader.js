/* MagicMirror²
 * Module: CDN js & css loader
 *
 * Redesigned by Răzvan Cristea
 * for iPad 3 & HD display
 *
 * https://github.com/razvanh255
 * Creative Commons BY-NC-SA 4.0, Romania. 
 *
 * Original MagicMirror² MIT Licensed.
 */
Module.register("cndloader", {
	  defaults: {
	    async: false,
	  },

    async start() {
        Log.info("Starting module: " + this.name);
        if (this.config.async) {
        	loadResources();
        }
    },

    getScripts () {
    	if (!this.config.async) {
			return [
				'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.30.1/moment-with-locales.min.js',
		        'https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.6.3/moment-timezone-with-data.min.js',
		        'https://cdnjs.cloudflare.com/ajax/libs/nunjucks/3.2.4/nunjucks.min.js',
		        'https://cdnjs.cloudflare.com/ajax/libs/suncalc/1.9.0/suncalc.min.js',
		        'https://cdnjs.cloudflare.com/ajax/libs/croner/8.1.2/croner.umd.min.js'
			];
		}
	},

	getStyles () {
		if (!this.config.async) {
			return [
			//	'https://fonts.googleapis.com',
			//	'https://fonts.gstatic.com',
				'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap',
				'https://fonts.googleapis.com/css2?family=Roboto+Condensed:ital,wght@0,100..900;1,100..900&display=swap',
				'https://cdnjs.cloudflare.com/ajax/libs/weather-icons/2.0.12/css/weather-icons.min.css',
		        'https://cdnjs.cloudflare.com/ajax/libs/weather-icons/2.0.12/css/weather-icons-wind.min.css',
		        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.3.1/css/all.min.css',
		        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.3.1/css/v4-shims.min.css',
		        'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css'
			];
		}
	},

	loadScript(url) {
	    return new Promise((resolve, reject) => {
	        if (document.querySelector(`script[src="${url}"]`)) {
	            Log.info(`Script already loaded: ${url}`);
	            resolve();
	            return;
	        }

	        const script = document.createElement('script');
	        script.src = url;
	        script.type = 'text/javascript';
	        script.onload = () => {
	            Log.info(`Loaded script: ${url}`);
	            resolve();
	        };
	        script.onerror = () => {
	            Log.error(`Failed to load script: ${url}`);
	            reject(new Error(`Script load error: ${url}`));
	        };
	        document.body.appendChild(script);
	    });
	},

	loadStyle(url) {
	    return new Promise((resolve, reject) => {
	        if (document.querySelector(`link[href="${url}"]`)) {
	            Log.info(`Style already loaded: ${url}`);
	            resolve();
	            return;
	        }

	        const link = document.createElement('link');
	        link.rel = 'stylesheet';
	        link.type = 'text/css';
	        link.href = url;
	        link.onload = () => {
	            Log.info(`Loaded style: ${url}`);
	            resolve();
	        };
	        link.onerror = () => {
	            Log.error(`Failed to load style: ${url}`);
	            reject(new Error(`Style load error: ${url}`));
	        };
	        document.head.appendChild(link);
	    });
	},

	/* For test only */

    async loadResources() {
        try {
        	await this.getFiles();
            Log.info("All scripts and styles loaded successfully.");
        } catch (error) {
            Log.error("Error loading resources: ", error);
        }
    },

    async getFiles() {
        const scripts = [
		//	'https://cdnjs.cloudflare.com/ajax/libs/jquery/4.0.0/jquery.min.js',
		//	'https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.8/js/bootstrap.bundle.min.js',
				'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.30.1/moment-with-locales.min.js',
		        'https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.6.3/moment-timezone-with-data.min.js',
		        'https://cdnjs.cloudflare.com/ajax/libs/nunjucks/3.2.4/nunjucks.min.js',
		        'https://cdnjs.cloudflare.com/ajax/libs/suncalc/1.9.0/suncalc.min.js',
		        'https://cdnjs.cloudflare.com/ajax/libs/croner/8.1.2/croner.umd.min.js'
        ];

        for (const script of scripts) {
            await this.loadScript(script);
        }

        const styles = [
		//	"https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.3/css/bootstrap.min.css",
		//	"https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.11.1/font/bootstrap-icons.min.css",
		//		'https://fonts.googleapis.com',
		//		'https://fonts.gstatic.com',
				'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap',
				'https://fonts.googleapis.com/css2?family=Roboto+Condensed:ital,wght@0,100..900;1,100..900&display=swap',
				'https://cdnjs.cloudflare.com/ajax/libs/weather-icons/2.0.12/css/weather-icons.min.css',
		        'https://cdnjs.cloudflare.com/ajax/libs/weather-icons/2.0.12/css/weather-icons-wind.min.css',
		        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.3.1/css/all.min.css',
		        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.3.1/css/v4-shims.min.css',
		        'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css'
        ];

        for (const style of styles) {
            await this.loadStyle(style);
        }
    }
});
