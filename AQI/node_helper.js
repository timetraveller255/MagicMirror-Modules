/* MagicMirror²
 * Module: MMM-AQI
 * By Ricardo Gonzalez
 * MIT Licensed.
 */

const NodeHelper = require("node_helper");
const https = require("https");
const Log = require("logger");

module.exports = NodeHelper.create({
	start() {
		Log.log("AQI helper started ...");
	},

	/**
	 * Fetch AQI data from API with improved error handling
	 * @param {string} url - API endpoint URL
	 * @param {string} identifier - Module identifier for proper routing
	 */
	async getAQIData(url, identifier) {
	  return new Promise((resolve) => {
	    const request = https.get(
	      url,
	      {
	        family: 4,
	        headers: {
	          "User-Agent": "MagicMirror-AQI/1.3.0",
	          "Accept": "application/json",
	        },
	      },
	      (response) => {
	        let body = "";

	        response.setEncoding("utf8");

	        response.on("data", (chunk) => {
	          body += chunk;
	        });

	        response.on("end", () => {
	          if (response.statusCode < 200 || response.statusCode >= 300) {
	            Log.error(
	              `AQI HTTP error for ${identifier}: ${response.statusCode}`
	            );

	            this.sendSocketNotification("AQI_ERROR", {
	              identifier,
	              error: {
	                type: "HTTP_ERROR",
	                message: `HTTP ${response.statusCode}`,
	                originalError: `HTTP ${response.statusCode}`,
	              },
	            });

	            resolve();
	            return;
	          }

	          try {
	            const data = JSON.parse(body);

	            if (!this.validateAPIResponse(data)) {
	              throw new Error("Invalid API response format");
	            }

	            Log.info(`AQI data fetched successfully for ${identifier}`);

	            this.sendSocketNotification("AQI_DATA", {
	              identifier,
	              data,
	            });

	            resolve();
	          } catch (error) {
	            Log.error(
	              `AQI JSON error for ${identifier}:`,
	              error.message
	            );

	            this.sendSocketNotification("AQI_ERROR", {
	              identifier,
	              error: {
	                type: "PARSE_ERROR",
	                message: error.message,
	                originalError: error.message,
	              },
	            });

	            resolve();
	          }
	        });
	      }
	    );

	    request.setTimeout(10000, () => {
	      request.destroy();
	      
	      Log.error(`AQI request timeout for ${identifier}`);

	      this.sendSocketNotification("AQI_ERROR", {
	        identifier,
	        error: {
	          type: "TIMEOUT",
	          message: "Request timeout",
	          originalError: "HTTPS request timeout",
	        },
	      });

	      resolve();
	    });

	    request.on("error", (error) => {
	      Log.error(
	        `AQI HTTPS error for ${identifier}:`,
	        error.message
	      );

	      this.sendSocketNotification("AQI_ERROR", {
	        identifier,
	        error: {
	          type: "NETWORK_ERROR",
	          message: error.message,
	          originalError: error.message,
	        },
	      });

	      resolve();
	    });
	  });
	},

	/**
	 * Validate API response structure
	 * @param {object} data - API response data
	 * @returns {boolean} True if valid
	 */
	validateAPIResponse(data) {
		if (!data || typeof data !== "object") {
			return false;
		}

		// Check for error response
		if (data.status === "error") {
			Log.warn("AQI API returned error:", data.data || data.message);
			return false;
		}

		// Check for required fields in successful response
		if (data.status !== "ok" || !data.data) {
			return false;
		}

		const requiredFields = ["aqi", "city"];
		return requiredFields.every((field) => data.data[field] !== undefined);
	},

	/**
	 * Handle socket notifications from frontend
	 * @param {string} notification - Notification type
	 * @param {object} payload - Notification payload
	 */
	socketNotificationReceived(notification, payload) {
		switch (notification) {
			case "GET_AQI":
				if (!payload.url || !payload.identifier) {
					Log.error("AQI: Missing required parameters");
					return;
				}
				this.getAQIData(payload.url, payload.identifier);
				break;

			default:
				Log.warn(`AQI: Unknown notification: ${notification}`);
		}
	},

	/**
	 * Clean up resources when stopping
	 */
	stop() {
		Log.log("AQI helper stopped");
	},
});
