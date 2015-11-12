/*

log.js - TelemetryEventsLog.log() test

The MIT License (MIT)

Copyright (c) 2014-2015 Tristan Slominski, Leora Pearson

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

var clone = require("clone");
var events = require('events');
var TelemetryEventsLog = require('../index.js');

var tests = module.exports = {};

var VALID_CONFIG = {
    telemetry: {
        emit: function (event) {return event;}
    }
};

function assertEqual(test, thingy, actualValueOfThingy, expectedValueOfThingy) {
    test.equal(actualValueOfThingy, expectedValueOfThingy, "expected value for " + thingy + " was '" + expectedValueOfThingy + "' but received '" + actualValueOfThingy + "'");
}

function assertDeepEqual(
    test, thingy, actualValueOfThingy, expectedValueOfThingy)
{
    test.deepEqual(actualValueOfThingy, expectedValueOfThingy,
        "expected value for " +
        thingy +
        " was '" +
        JSON.stringify(expectedValueOfThingy) +
        "' but received '" +
        JSON.stringify(actualValueOfThingy));
}

tests['returns the event'] = function (test) {
    test.expect(5);
    var telemetry = new TelemetryEventsLog(VALID_CONFIG);
    var event = telemetry.log('info', "'ello", {foo: 'bar', baz: {hi: 'there'}});
    assertEqual(test, 'event.type', event.type, 'log');
    assertEqual(test, 'event.level', event.level, 'info');
    assertEqual(test, 'event.message', event.message, "'ello");
    assertEqual(test, 'event.foo', event.foo, 'bar');
    test.deepEqual(event.baz, {hi: 'there'}, "expected value for event.baz was '" + JSON.stringify({hi: 'there'}) + "' but received '" + JSON.stringify(event.baz));
    test.done();
};

tests['allows custom to be passed as the second parameter instead of message'] = function (test) {
    test.expect(5);
    var telemetry = new TelemetryEventsLog(VALID_CONFIG);
    var event = telemetry.log('info', {foo: 'bar', baz: {hi: 'there'}});
    assertEqual(test, 'event.type', event.type, 'log');
    assertEqual(test, 'event.level', event.level, 'info');
    test.ok(event.message === undefined, "expected value for event.message was undefined but received '" + event.message + "'");
    assertEqual(test, 'event.foo', event.foo, 'bar');
    test.deepEqual(event.baz, {hi: 'there'}, "expected value for event.baz was '" + JSON.stringify({hi: 'there'}) + "' but received '" + JSON.stringify(event.baz)) + "'";
    test.done();
};

tests["should call telemetry.emit() to emit event"] = function (test) {
    test.expect(1);
    var emittedEvent;
    var telemetry = new TelemetryEventsLog({
            telemetry: {
                emit: function (event) {
                    emittedEvent = event;
                    return emittedEvent;
                }
            }
        });
    var returnedEvent = telemetry.log('info', "'ello", {foo: 'bar', baz: {hi: 'there'}});
    test.strictEqual(emittedEvent, returnedEvent, "emitted event was not the same as returned event");
    test.done();
};

tests["should call telemetry.emit() with common data to emit event"] = function(test)
{
    test.expect(3);
    var _common = {
        some: "common data",
        with: {
            some: "more data"
        }
    };
    var _event = {
        foo: "bar",
        baz: {
            hi: "there"
        },
        with: {
            other: "data"
        }
    };
    var _stub = {};
    var telemetry = new TelemetryEventsLog(
    {
        telemetry: {
            emit: function(common, event)
            {
                assertDeepEqual(test, "common", common, _common);
                assertDeepEqual(test, "event", event,
                {
                    type: "log",
                    level: "info",
                    message: "'ello",
                    foo: _event.foo,
                    baz: _event.baz,
                    with: _event.with
                });
                return _stub;
            }
        }
    });
    var returnedEvent = telemetry.log("info", "'ello", _common, clone(_event));
    test.strictEqual(returnedEvent, _stub,
                     "emitted event was not the same as returned event");
    test.done();
};

tests["allows common to be passed as the second parameter instead of message"] = function(test)
{
    test.expect(3);
    var _common = {
        some: "common data",
        with: {
            some: "more data"
        }
    };
    var _event = {
        foo: "bar",
        baz: {
            hi: "there"
        },
        with: {
            other: "data"
        }
    };
    var _stub = {};
    var telemetry = new TelemetryEventsLog(
    {
        telemetry: {
            emit: function(common, event)
            {
                assertDeepEqual(test, "common", common, _common);
                assertDeepEqual(test, "event", event,
                {
                    type: "log",
                    level: "info",
                    foo: _event.foo,
                    baz: _event.baz,
                    with: _event.with
                });
                return _stub;
            }
        }
    });
    var returnedEvent = telemetry.log("info", _common, clone(_event));
    test.strictEqual(returnedEvent, _stub,
                     "emitted event was not the same as returned event");
    test.done();
};
