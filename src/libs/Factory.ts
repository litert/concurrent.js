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

import * as C from "./Common";
import RateLimiter from "./RateLimiter/RateLimiter";
import Semaphore from "./Semaphore/Semaphore";

class Factory
implements C.IFactory {

    private _drivers: Record<string, Record<string, any>>;

    public constructor() {

        this._drivers = {
            "rate_limiter": {},
            "semaphore": {}
        };
    }

    public registerDriver(
        type: string,
        name: string,
        driver: any,
        asDefault: boolean = false
    ): this {

        if (this._drivers[type][name]) {

            throw new Error(`Duplicated driver "${name}" of type "${type}".`);
        }

        this._drivers[type][name] = driver;

        if (asDefault) {

            this._drivers[type]["default"] = driver;
        }

        return this;
    }

    public getDriver(type: string, name: string): any {

        if (!this._drivers[type][name]) {

            throw new Error(
                `The driver named "${name}" of type "${type}" doesn't exist.`
            );
        }

        return this._drivers[type][name];
    }

    public unregisterDriver(type: string, name: string): Promise<void> | void {

        const d = this.getDriver(type, name);

        if (d) {

            delete this._drivers[type][name];

            return d.close();
        }
    }

    public createRateLimiter(
        opts: C.RateLimiter.IOptions
    ): C.RateLimiter.IObject {

        return new RateLimiter(
            opts.currency,
            opts.period,
            opts.key,
            this.getDriver("rate_limiter", opts.driver || "default")
        );
    }

    public createSemaphore(
        opts: C.Semaphore.IOptions
    ): C.Semaphore.IObject {

        return new Semaphore(
            opts.currency,
            opts.key,
            this.getDriver("semaphore", opts.driver || "default")
        );
    }
}

export function createFactory(): C.IFactory {

    return new Factory();
}
