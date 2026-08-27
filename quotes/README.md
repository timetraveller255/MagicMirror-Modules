# Random quotes for MagicMirror&sup2;

[![Platform](https://img.shields.io/badge/platform-MagicMirror2-informational)](https://github.com/cristearazvanh/MagicMirror2)
[![CC-0 license](https://img.shields.io/badge/License-CC--4.0-blue.svg)](https://creativecommons.org/licenses/by-nd/4.0)

The `quotes` module returns a random quote based on the category set. See the section on `Updating Quotes` below.

## Using the module
To use this module, add it to the modules array in the `config/config.js` file:
````javascript
modules: [
			{
				module: 'quotes',
				position: 'lower_third',
				config: {
						// The config property is optional
						// Without a config, a random quote is shown,
						// selected from all of the categories available.
				}
			}
]
````

## Configuration options
The `quotes` module allows you to pick quotes randomly

<table>
	<thead>
		<tr>
			<th>Options</th>
			<th>Description</th>
			<th>Default</th>
		</tr>
	</thead>
	<tfoot>
		<tr>
			<th colspan="3"><em>More options may get added later.</em></th>
		</tr>
	</tfoot>
	<tbody>
		<tr>
			<td><code>updateInterval</code></td>
			<td>How often a new quote gets displayed. <strong>Value is in SECONDS.</strong></td>
			<td><code>300</code> seconds (every 5 minutes)</td>
		</tr>
		<tr>
			<td><code>fadeSpeed</code></td>
			<td>How fast <strong>(in SECONDS)</strong> to fade out and back in when changing quotes.</td>
			<td><code>4</code> seconds</td>
		</tr>
		<tr>
			<td><code>category</code></td>
			<td>What category to pick from.</td>
			<td><code>random</code> - The <code>random</code> setting will pick a random quote out of all the available categories. Or you can set it to a specific category: <code>inspirational</code>, <code>life</code>, <code>love</code>, <code>motivational</code>, <code>positive</code>, or <code>success</code>.</td>
		</tr>
	</tbody>
</table>

## Updating Quotes
You can edit the `quotes.js` file and add/remove quotes from the various sections. You may even delete an entire
section.

Redesigned by Răzvan Cristea https://github.com/razvanh255 Creative Commons BY-NC-SA 4.0, Romania.
