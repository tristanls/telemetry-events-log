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
    * [LogTelemetryEvents](#logtelemetryevents)

## Installation

    npm install telemetry-events-log

## Usage

To run the below example run:

    npm run readme

```javascript
"use strict";

var events = require('events');
var pkg = require('../package.json');
var LogTelemetryEvents = require('../index.js');

var emitter = new events.EventEmitter();

var telemetry = new LogTelemetryEvents({emitter: emitter, package: pkg});

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

  * [LogTelemetryEvents](#logtelemetryevents)

### LogTelemetryEvents

**Public API**

  * [new LogTelemetryEvents(config)](#new-logtelemetryeventsconfig)
  * [telemetry.log(level, \[message\], \[custom\])](#telemetryloglevel-message-custom)

### new LogTelemetryEvents(config)

  * `config`: _Object_
    * `telemetry`: _Object_ TelemetryEvents instance.
  * Return: _Object_ Instance of LogTelemetryEvents.

Creates a new LogTelemetryEvents instance.

### telemetry.log(level, [message], [custom])

  * `level`: _String_ Log level to be used for `event.level` property.
  * `message`: _String_ _(Default: undefined)_ An optional message to be used for `event.message` property.
  * `custom`: _Object_ _(Default: undefined)_ Optional object with custom properties to add to the event.
  * Return: _Object_ The event.

Helper to create and emit a "log" event. The created event will have the following properties in addition to included by TelemetryEvents.

```javascript
{
    type: 'log',
    level: <level>,
    message: <message> // if provided
}
```

Any property of `custom` Object will be attached to the above event template. You can also use `custom` to override any of the above properties.
