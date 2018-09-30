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

import RateLimiters from "../libs";

import logs from "./loggers";

const semaphore = RateLimiters.createSemaphore({
    key: "test",
    currency: 3
});

function sleep(ms: number): Promise<void> {

    return new Promise((r) => setTimeout(r, ms));
}

setInterval(async () => {

    const timeout = Math.floor(10 + Math.random() * 1000);

    const handle = await semaphore.enter(timeout);

    if (handle) {

        const handleD = handle.padEnd(20, "0");

        const wait = Math.floor(10 + Math.random() * 1000);

        logs.info(`Lock: Ok        Handle: ${
            handleD
        } Timeout: ${
            timeout.toString().padStart(4, " ")
        } Wait: ${
            wait.toString().padStart(4, " ")
        } Expect: ${wait > timeout ? "Maybe-Expired" : "Ok"}`);

        await sleep(wait);

        if (await semaphore.leave(handle)) {

            logs.notice(`Unlock: Ok      Handle: ${
                handleD
            }`);
        }
        else {

            logs.warning(`Unlock: Expired Handle: ${
                handleD
            }`);
        }
    }
    else {

        logs.error(`Lock: No`);
    }

}, 100);
