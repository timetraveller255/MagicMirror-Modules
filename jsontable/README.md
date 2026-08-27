# JsonTable for MagicMirror&sup2;

[![Platform](https://img.shields.io/badge/platform-MagicMirror2-informational)](https://github.com/cristearazvanh/MagicMirror2)
[![CC-0 license](https://img.shields.io/badge/License-CC--4.0-blue.svg)](https://creativecommons.org/licenses/by-nd/4.0)

A module which creates a table filled with a list gathered from a json request.

All the variables of the objects in the array are represented by a table column.
For every column it checks if a valid DateTime is given, and then formats it to HH:mm:ss if it is today or YYYY-MM-DD otherwise.
If json file is converted from Excel must be UTF-8 encoded.

## Config Options
| **Option** | **Default** | **Description** |
| --- | --- | --- |
| url | "" | The full url to get the json response from |
| arrayName | null | Define the name of the variable that holds the array to display |
| keepColumns | [] | Columns on json will be showed |
| tryFormatDate | false | For every column it checks if a valid DateTime is given, and then formats it to HH:mm:ss if it is today or YYYY-MM-DD otherwise |
| size | 0-3 | Text size at table, 0 is default, and 3 is H3 |
| updateInterval | 15000 | Milliseconds between the refersh |
| descriptiveRow | "" | Complete html table row that will be added above the array data |

Redesigned by Răzvan Cristea https://github.com/cristearazvanh Creative Commons BY-NC-SA 4.0, Romania.
