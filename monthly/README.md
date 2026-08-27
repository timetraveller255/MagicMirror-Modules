# Calendar with multiple months (user configurable)

[![Platform](https://img.shields.io/badge/platform-MagicMirror2-informational)](https://github.com/cristearazvanh/MagicMirror2)
[![CC-0 license](https://img.shields.io/badge/License-CC--4.0-blue.svg)](https://creativecommons.org/licenses/by-nd/4.0)

It's purpose is to enable a mini-calendar with as many months as the user wants, assuming screen space is available.

To use this module, add it to the modules array in the config/config.js file:

```
{
  module: 'monthly',
	position: 'top_left', 				// can be any of the postions
	config: { 					// Optional - will default to 3 months, with one previous and one next, vertical orientation. 
		startMonth: -1, 			// Define when you start from current month (negative is before current, zero is current, positive is in future) 
		monthCount: 3, 				//  How many months to display - If Month Count is 1, Calendar will show previous and next month dates in empty spots.  
		monthsVertical: true, 			// Whether to arrange the months vertically (true) or horizontally (false).
		repeatWeekdaysVertical: false,		// Whether to repeat the week days in each month in vertical mode. Ignored in horizontal mode.
		weekNumbers: false, 			// Whether to display the week numbers in front of each week.
		highlightWeekend: false, 		// Highlight Saturday and Sunday
	}
},
```

Localization is provided by moment.js and controlled by the master language of MagicMirror. Please file any errors with localizations as bugs with the moment.js team - https://github.com/moment/moment/

Redesigned by Răzvan Cristea https://github.com/cristearazvanh Creative Commons BY-NC-SA 4.0, Romania.
