# Display a calendar with multiple months (user configurable)

<img src=https://github.com/timetraveller255/MagicMirror/blob/master/modules/multimonth/monthly.png>.


## Using the module


```js

{
  module: 'multimonth',
    position: 'top_left', // can be any of the postions
    config: { // Optional - will default to 3 months, with one previous and one next, vertical orientation.
    }
},
```

**Full config options:**

| Option                 | Default | Description                                                  |
| ---------------------- | ------- | ------------------------------------------------------------ |
| startMonth             | -1      | Starting month relative to the current month                 |
| monthCount             | 3       | How many months do you want to display?                      |
| monthsVertical         | false   | Display months on a vertical line                            |
| repeatWeekdaysVertical | false   | Repeat the weekday names? (Vertical Calendar Only)           |
| weekNumbers            | false   | Show the week numbers (How many weeks in the year)           |
| weekNumbersISO         | false   | Use ISO calculation or US/CA calculation (ignored if WeekNumbers is false) True = ISO, False = US/Canada. |
| highlightWeekend       | false   | highlight the weekend (See Below)                            |
| headerType             | 'short' | How do you want the days displayed? In US - 'short' = "Sun, Mon, Tue" In US - 'narrow' = "S, M, T" |
| otherMonths            | false   | Display the previous and next month dimmed in the month grid. |
| eventsOn               | true    | Turn on and off Event monitoring                             |
| calNames               | []      | List of calendar names to trigger underline. Empty will do all of them. calNames is an array, please specify as such `["Main", "Sportsball", "Utility"]` case is IMPORTANT |
| bigCalendar            | false   | Enable alternate big calendar mode, See below                |
| instanceID             |         | If you'd like to have changes per instance, use a string here and specify in CSS. |
| startWeek              | 0       | Starting day of your week                                    |
| weekend1               | 0       | 1st Day of your weekend                                      |
| weekend2               | 6       | 2nd day of your weekend                                      |


for the last three items: 0 = Sunday, 1 = Monday, 2 = Tuesday, 3 = Wednesday, 4 = Thursday, 5 = Friday, 6 = Saturday.



Important: calNames is an array, please specify as such `["Main", "Sportsball", "Utility"]` case is IMPORTANT.

instanceID: You can specify in custom.css different css for each instance. For example, if you add `instanceID: "test",` to your code, you can overide that instance with:

```css
.multimonth .month-header.test {
  background-color: blue;
  color: var(--color-header);
  font-size: var(--font-size-small);
  line-height: var(--font-size-small)+5;
  border-radius: var(--back-rounding);
}
```

To get events to feed to module, add the calendar module into your `config.js`.

Suggested settings at minimum:  

```js
		{
			module: "calendar",
			config: {
				broadcastPastEvents: true,
				calendars: [
					{
						url: <insert URL>,
						name: <name>,
					},
					//.... As many as you'd like .... 
				],
			}
		},
```

### Event Symbols: 

The module now can use the symbols from the calendar module in big calendar mode. 

Example (uses public calendar): 

``` js
{
	url: "https://calendar.google.com/calendar/ical/ro.romanian%23holiday%40group.v.calendar.google.com/public/basic.ics",
	name: "Sarbatori",
	symbol: "calendar",
	color: "#4B2E83",
},
```



Module taken from https://github.com/KirAsh4/calendar_monthly and modified by https://github.com/BKeyport/MMM-Multimonth
