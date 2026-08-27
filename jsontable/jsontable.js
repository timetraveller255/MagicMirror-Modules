/* MagicMirror²
 * Module: json table
 *
 * Redesigned by Răzvan Cristea
 * for iPad 3 & HD display
 *
 * https://github.com/razvanh255
 * Creative Commons BY-NC-SA 4.0, Romania. 
 *
 * Original MagicMirror² MIT Licensed.
 */

Module.register("jsontable", {
	// Default module config.
	defaults: {
		url: "",
		arrayName: null,
		noDataText: "Json data is not of type array!<br>Maybe the config arrayName is not used<br>and should be, or is configured wrong.",
		keepColumns: [],
		size: 0,
		cssStyle: "jsontable.css",
		tryFormatDate: false,
		updateInterval: 60 * 1000,
		animationSpeed: config.animation,
		descriptiveRow: null
	},

	jsonData: null,

	getStyles: function () {
		return [this.config.cssStyle];
	//	this.data.path + this.config.cssStyle + ".css"
	},

	getScripts: function () {
		return [
				//	"moment.js"
				];
	},

	start: function () {
		Log.info("Starting module: " + this.name);
		this.getJson();
		this.scheduleUpdate();
	},

	scheduleUpdate: function () {
		var self = this;
		setInterval(function () {
			self.getJson();
		}, this.config.updateInterval);
	},

	// Request node_helper to get json from url
	getJson: function () {
		var self = this;
		this.jsonFile(function (response) {
			self.jsonData = JSON.parse(response);
        //    console.log(self.jsonData); // for checking
			self.updateDom(self.config.animationSpeed);
		});
	},

	jsonFile: function (callback) {
		var xobj = new XMLHttpRequest(),
		isRemote = this.config.url.indexOf("http://") === 0 || this.config.url.indexOf("https://") === 0,
		path = isRemote ? this.config.url : this.file(this.config.url);
		xobj.overrideMimeType("application/json");
		xobj.open("GET", path, true);
		xobj.onreadystatechange = function () {
			if (xobj.readyState === 4 && xobj.status === 200) {
				callback(xobj.responseText);
			//	console.log("Response " + xobj.responseText); // for checking
			}
		};
		xobj.send(null);
	},

	// Override dom generator.
	getDom: function () {
		var self = this;
		var wrapper = document.createElement("div");
		wrapper.className = this.config.tableClass  + " normal";

		if (!this.jsonData) {
			wrapper.innerHTML = "Awaiting json data...";
			return wrapper;
		}
		
		var table = document.createElement("table");
		var tbody = document.createElement("tbody");
		
		var items = [];
		if (this.config.arrayName) {
			items = this.jsonData[this.config.arrayName];
		}
		else {
			items = this.jsonData;
		}

		// Check if items is of type array
		if (!(items instanceof Array)) {
			wrapper.innerHTML = this.config.noDataText;
			return wrapper;
		}

		items.forEach(function (element) {
			var row = self.getTableRow(element);
			tbody.appendChild(row);
		});
		
		// Add in Descriptive Row Header
		if (this.config.descriptiveRow) {
			var header = table.createTHead();
			header.innerHTML = this.config.descriptiveRow;
		}

		table.appendChild(tbody);
		wrapper.appendChild(table);
		return wrapper;
	},

	getTableRow: function (jsonObject) {
		var self = this;
	    var row = document.createElement("tr");
	    Object.entries(jsonObject).forEach(function (a) {
	        var key = a[0], value = a[1];
	        var cell = document.createElement("td");
	        var valueToDisplay = "";
	        if (key === "icon") {
	            cell.classList.add("fa", value);
	        }
	        else if (self.config.tryFormatDate) {
	            valueToDisplay = self.getFormattedValue(value);
	        }
	        else if (self.config.keepColumns.length === 0 ||
	            self.config.keepColumns.indexOf(key) >= 0) {
	            valueToDisplay = value;
	        }
	        var cellText = document.createTextNode(valueToDisplay);
	        if (self.config.size > 0 && self.config.size < 9) {
	            var h = document.createElement("H" + self.config.size);
	            h.appendChild(cellText);
	            cell.appendChild(h);
	        }
	        else {
	            cell.appendChild(cellText);
	        }
	        row.appendChild(cell);
	    });
	    return row;
	},

	// Format a date string or return the input
	getFormattedValue: function (input) {
		var m = moment(input);
		if (typeof input === "string" && m.isValid()) {
			// Show a formatted time if it occures today
			if (m.isSame(new Date(), "day") && m.hours() !== 0 && m.minutes() !== 0 && m.seconds() !== 0) {
				return m.format("HH:mm:ss");
			}
			else {
				return m.format("YYYY-MM-DD");
			}
		}
		else {
			return input;
		}
	}
});