/*

index.js: telemetry-events-log

The MIT License (MIT)

Copyright (c) 2014 Tristan Slominski, Leora Pearson

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

*/

"use strict";

module.exports = LogTelemetryEvents;

var REQUIRED_CONFIG_PROPERTIES = ["telemetry"];

/*
  * `config`: _Object_
    * `telemetry`: _Object_ TelemetryEvents instance.
  * Return: _Object_ Instance of LogTelemetryEvents.
*/
function LogTelemetryEvents(config) {
    var self = this;

    config = config || {};

    REQUIRED_CONFIG_PROPERTIES.forEach(function(property) {
        if (!(self["_" + property] = config[property])) {
            throw new Error("config is missing required property: " + property);
        }
    });
};

/*
  * `level`: _String_ Log level to be used for `event.level` property.
  * `message`: _String_ _(Default: undefined)_ An optional message to be used for `event.message` property.
  * `custom`: _Object_ _(Default: undefined)_ Optional object with custom properties to add to the event.
  * Return: _Object_ The event.
*/
LogTelemetryEvents.prototype.log = function log(level, message, custom) {
    var self = this;

    var event = {
        type: 'log',
        level: level,
    };
    // allow custom to be passed as second parameter
    if (message && typeof message != "string") {
        custom = message;
        message = null;
    }
    if (message) {
        event.message = message;
    }
    if (custom) {
        Object.keys(custom).forEach(function(property) {
            event[property] = custom[property];
        });
    }

    return self._telemetry.emit(event);
};
