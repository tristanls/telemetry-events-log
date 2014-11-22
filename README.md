# telemetry-events-log

_Stability: 1 - [Experimental](https://github.com/tristanls/stability-index#stability-1---experimental)_

[![NPM version](https://badge.fury.io/js/telemetry-events-log.png)](http://npmjs.org/package/telemetry-events-log)

Helper for creating and emitting telemetry log events.

## Contributors

[@tristanls](https://github.com/tristanls), [@lpearson05](https://github.com/lpearson05)

## Contents

  * [Installation](#installation)
  * [Usage](#usage)
  * [Tests](#tests)
  * [Documentation](#documentation)
    * [TelemetryEventsLog](#telemetryeventslog)

## Installation

    npm install telemetry-events-log

## Usage

To run the below example run:

    npm run readme

```javascript
"use strict";

var events = require('events');
var pkg = require('../package.json');
var TelemetryEventsLog = require('../index.js');

var emitter = new events.EventEmitter();

var telemetry = new TelemetryEventsLog({emitter: emitter, package: pkg});

emitter.on('telemetry', function (event) {
    console.dir(event);
});

telemetry.log('info', 'hello info level');
telemetry.log('warn', 'hello warn level');
telemetry.log('error', 'hello error with custom data', {custom: 'data'});

```

## Tests

    npm test

## Documentation

  * [TelemetryEventsLog](#telemetryeventslog)

### TelemetryEventsLog

**Public API**

  * [new TelemetryEventsLog(config)](#new-telemetryeventslogconfig)
  * [telemetry.emit(event)](#telemetryemitevent)
  * [telemetry.log(level, \[message\], \[custom\])](#telemetryloglevel-message-custom)

### new TelemetryEventsLog(config)

  * `config`: _Object_
    * `package`: _Object_ Contents of `package.json`.
      * `name`: _String_ Module name.
      * `version`: _String_ Module version.
    * `emitter`: _EventEmitter_ _(Default: undefined)_ An optional event emitter to emit events when `log()` is called.
    * `eventName`: _String_ _(Default: 'telemetry')_ An optional event name used for event emission if `emitter` is specified.

Creates a new TelemetryEventsLog instance.

### telemetry.emit(event)

  * `event`: _Object_ Event to be emitted.

Calling this method if `emitter` is not defined does nothing.

When `emitter` is defined, calling this method will emit the `event` using `eventName`, if provided, or "telemetry" (by default).

### telemetry.log(level, [message], [custom])

  * `level`: _String_ Log level to be used for `event.level` property.
  * `message`: _String_ _(Default: undefined)_ An optional message to be used for `event.message` property.
  * `custom`: _Object_ _(Default: undefined)_ Optional object with custom properties to add to the event.
  * Return: _Object_ The event.

Helper to create "log" event. If `emitter` was specified in configuration, calling this helper will also emit this event. The created event object will have the following properties:

```javascript
{
    type: 'log',
    level: <level>,
    message: <message>, // if provided
    timestamp: new Date().toISOString(),
    provenance: [{module: <package.name>, version: <package.version>},...]
}
```

Any property of `custom` Object will be attached to the above event template. You can also use `custom` to override any of the above properties.
