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

import * as C from "../Common";

export class RateLimiter
implements C.RateLimiter.IObject {

    private _currency: number;

    private _period: number;

    private _key: string;

    private _driver: C.RateLimiter.IDriver;

    public constructor(
        currency: number,
        period: number,
        key: string,
        driver: C.RateLimiter.IDriver
    ) {

        this._currency = currency;
        this._key = key;
        this._driver = driver;
        this._period = period;
    }

    public get currency(): number {

        return this._currency;
    }

    public get period(): number {

        return this._period;
    }

    public get key(): string {

        return this._key;
    }

    public walk(step: number = 1): boolean | Promise<boolean> {

        return this._driver.walk(
            this._key,
            step,
            this._currency,
            this._period
        );
    }

    public reset(): boolean | Promise<boolean> {

        return this._driver.reset(this._key, this._currency, this._period);
    }
}

export default RateLimiter;
