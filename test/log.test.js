/*

log.test.js - TelemetryEventsLog.log() test

The MIT License (MIT)

Copyright (c) 2014-2019 Tristan Slominski, Leora Pearson

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

const clone = require("clone");
const events = require('events');
const TelemetryEvents = require("telemetry-events");
const TelemetryEventsLog = require('../index.js');

const VALID_CONFIG =
{
    telemetry: new TelemetryEvents(
        {
            package:
            {
                name: "package-name",
                version: "package-version"
            }
        }
    )
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

expect.extend(
    {
        toBeISO8601Date(received)
        {
            const pass = received === new Date(received).toISOString();
            if (pass)
            {
                return (
                    {
                        message: () => `expected ${received} not to be ISO8601 Date`,
                        pass: true
                    }
                );
            }
            return (
                {
                    message: () => `expected ${received} to be ISO8601 Date`,
                    pass: false
                }
            );
        }
    }
);

it("returns the event", () =>
    {
        const telemetry = new TelemetryEventsLog(VALID_CONFIG);
        const common =
        {
            foo: "bar",
            baz:
            {
                hi: "there"
            },
            provenance:
            [
                {}
            ]
        };
        let event = telemetry.log("info", "'ello", common,
            {
                custom: "thing"
            }
        );
        expect(event).toEqual(
            {
                type: "log",
                level: "info",
                message: "'ello",
                foo: "bar",
                baz:
                {
                    hi: "there"
                },
                custom: "thing",
                provenance:
                [
                    {},
                    {
                        module: "package-name",
                        version: "package-version"
                    }
                ],
                timestamp: expect.toBeISO8601Date()
            }
        );
        expect(common.provenance.length).toBe(1);
        event = telemetry.log("info", "'ello", common);
        expect(event).toEqual(
            {
                type: "log",
                level: "info",
                message: "'ello",
                foo: "bar",
                baz:
                {
                    hi: "there"
                },
                provenance:
                [
                    {},
                    {
                        module: "package-name",
                        version: "package-version"
                    }
                ],
                timestamp: expect.toBeISO8601Date()
            }
        );
        expect(common.provenance.length).toBe(1);
        event = telemetry.log("info", "'ello");
        expect(event).toEqual(
            {
                type: "log",
                level: "info",
                message: "'ello",
                provenance:
                [
                    {
                        module: "package-name",
                        version: "package-version"
                    }
                ],
                timestamp: expect.toBeISO8601Date()
            }
        );
        event = telemetry.log("info");
        expect(event).toEqual(
            {
                type: "log",
                level: "info",
                provenance:
                [
                    {
                        module: "package-name",
                        version: "package-version"
                    }
                ],
                timestamp: expect.toBeISO8601Date()
            }
        );
    }
);

it("allows custom to be passed as the second parameter instead of message", () =>
    {
        const telemetry = new TelemetryEventsLog(VALID_CONFIG);
        const event = telemetry.log("info",
            {
                foo: "bar",
                baz:
                {
                    hi: "there"
                }
            }
        );
        expect(event).toEqual(
            {
                type: "log",
                level: "info",
                foo: "bar",
                baz:
                {
                    hi: "there"
                },
                provenance:
                [
                    {
                        module: "package-name",
                        version: "package-version"
                    }
                ],
                timestamp: expect.toBeISO8601Date()
            }
        );
    }
);

it("should call telemetry.emit() to emit event", () =>
    {
        let emittedEvent;
        const telemetry = new TelemetryEventsLog(
            {
                telemetry:
                {
                    emit: event =>
                    {
                        emittedEvent = event;
                        return emittedEvent;
                    }
                }
            }
        );
        const returnedEvent = telemetry.log("info", "'ello",
            {
                foo: "bar",
                baz:
                {
                    hi: "there"
                }
            }
        );
        expect(returnedEvent).toBe(emittedEvent);
    }
);

it("should call telemetry.emit() with common data to emit event", () =>
    {
        const _common =
        {
            some: "common data",
            with:
            {
                some: "more data"
            }
        };
        const _event =
        {
            foo: "bar",
            baz:
            {
                hi: "there"
            },
            with:
            {
                other: "data"
            }
        };
        const _stub = {};
        const telemetry = new TelemetryEventsLog(
            {
                telemetry:
                {
                    emit: (common, event) =>
                    {
                        expect(common).toEqual(_common);
                        expect(event).toEqual(
                            {
                                type: "log",
                                level: "info",
                                message: "'ello",
                                foo: "bar",
                                baz:
                                {
                                    hi: "there"
                                },
                                with:
                                {
                                    other: "data"
                                }
                            }
                        );
                        return _stub;
                    }
                }
            }
        );
        const returnedEvent = telemetry.log("info", "'ello", _common, clone(_event));
        expect(returnedEvent).toBe(_stub);
    }
);

it("allows common to be passed as the second parameter instead of message", () =>
    {
        const _common =
        {
            some: "common data",
            with:
            {
                some: "more data"
            }
        };
        const _event =
        {
            foo: "bar",
            baz:
            {
                hi: "there"
            },
            with:
            {
                other: "data"
            }
        };
        const _stub = {};
        const telemetry = new TelemetryEventsLog(
            {
                telemetry:
                {
                    emit: (common, event) =>
                    {
                        expect(common).toEqual(_common);
                        expect(event).toEqual(
                            {
                                type: "log",
                                level: "info",
                                foo: "bar",
                                baz:
                                {
                                    hi: "there"
                                },
                                with:
                                {
                                    other: "data"
                                }
                            }
                        );
                        return _stub;
                    }
                }
            }
        );
        const returnedEvent = telemetry.log("info", _common, clone(_event));
        expect(returnedEvent).toBe(_stub);
    }
);
