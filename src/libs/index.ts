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

export * from "./Common";
export * from "./Factory";

import * as Common from "./Common";
import * as Factory from "./Factory";
import * as Drivers from "./Drivers";

export { Drivers };

const defaultFactory = Factory.createFactory();

defaultFactory.registerDriver(
    "rate_limiter",
    "in-memory",
    new Drivers.RateLimiter.InMemoryDriver(),
    true
);

defaultFactory.registerDriver(
    "semaphore",
    "in-memory",
    new Drivers.Semaphore.InMemoryDriver(),
    true
);

export default defaultFactory;

export function getDefaultFactory(): Common.IFactory {

    return defaultFactory;
}
