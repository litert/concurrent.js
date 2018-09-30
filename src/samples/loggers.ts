/**
 *  Copyright 2018 Angus.Fenying <fenying@litert.org>
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import * as Loggers from "@litert/logger";

const colors = Loggers.createColorfulTTYDriver();

colors.foreColor("green", "info");
colors.foreColor("red", "error");
colors.foreColor("yellow", "warning");
colors.foreColor("grey", "notice");
colors.foreColor("cyan", "debug");

Loggers.getDefaultFactory().registerDriver(
    "cli",
    colors
);

const logs = Loggers.getDefaultFactory().createTextLogger(
    "Sample",
    function(log: string, m, l, d): string {

        return `[${d.toISOString()}] ${log}`;
    },
    "cli"
);

logs.unmute();

export default logs;
