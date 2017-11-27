# telemetry-events-log

_Stability: 2 - [Stable](https://github.com/tristanls/stability-index#stability-2---stable)_

[![NPM version](https://badge.fury.io/js/telemetry-events-log.png)](http://npmjs.org/package/telemetry-events-log)

Helper for creating and emitting [TelemetryEvents](https://github.com/tristanls/telemetry-events) for logs.

## Contributors

[@tristanls](https://github.com/tristanls), [@lpearson05](https://github.com/lpearson05)

## Contents

  * [Installation](#installation)
  * [Usage](#usage)
  * [Tests](#tests)
  * [Documentation](#documentation)
    * [LogTelemetryEvents](#logtelemetryevents)
  * [Releases](#releases)

## Installation

    npm install telemetry-events-log

## Usage

To run the below example run:

    npm run readme

```javascript
"use strict";

var events = require('events');
var pkg = require('../package.json');
var TelemetryEvents = require('telemetry-events');

var LogTelemetryEvents = require('../index.js');

var emitter = new events.EventEmitter();

var telemetryEvents = new TelemetryEvents({emitter: emitter, package: pkg});

var logTelemetry = new LogTelemetryEvents({telemetry: telemetryEvents});

emitter.on('telemetry', function (event) {
    console.dir(event);
});

logTelemetry.log('info', 'hello info level');
logTelemetry.log('warn', 'hello warn level');
logTelemetry.log('error', 'hello error with common data', {common: 'data'});

var _commonEventData = {
    method: "readme"
};
logTelemetry.log("info",
{
    common: "data with no message and no custom event data attached"
});
logTelemetry.log("info", _commonEventData,
{
    custom: "data with common and custom event data attached"
});
logTelemetry.log("info", "my message", _commonEventData,
{
    custom: "data with message and common and custom event data attached"
});

```

## Tests

    npm test

## Documentation

  * [LogTelemetryEvents](#logtelemetryevents)

### LogTelemetryEvents

**Public API**

  * [new LogTelemetryEvents(config)](#new-logtelemetryeventsconfig)
  * [telemetry.log(level, \[message\], \[common\], \[custom\])](#telemetryloglevel-message-common-custom)

### new LogTelemetryEvents(config)

  * `config`: _Object_
    * `telemetry`: _Object_ TelemetryEvents instance.
  * Return: _Object_ Instance of LogTelemetryEvents.

Creates a new LogTelemetryEvents instance.

### telemetry.log(level, [message], [common], [custom])

  * `level`: _String_ Log level to be used for `event.level` property.
  * `message`: _String_ _(Default: undefined)_ An optional message to be used for `event.message` property.
  * `common`: _Object_ _(Default: undefined)_ Optional common event data to clone and extend with the `event` data.
  * `custom`: _Object_ _(Default: undefined)_ Optional object with custom properties to add to the event.
  * Return: _Object_ The event.

Helper to create and emit a "log" event. The created event will have the following properties in addition to those included by [TelemetryEvents](https://github.com/tristanls/telemetry-events).

```javascript
{
    type: 'log',
    level: <level>,
    message: <message> // if provided
}
```

Any property of `custom` Object will be attached to the above event template. You can also use `custom` to override any of the above properties.

## Releases

We follow semantic versioning policy (see: [semver.org](http://semver.org/)):

> Given a version number MAJOR.MINOR.PATCH, increment the:
>
>MAJOR version when you make incompatible API changes,<br/>
>MINOR version when you add functionality in a backwards-compatible manner, and<br/>
>PATCH version when you make backwards-compatible bug fixes.
