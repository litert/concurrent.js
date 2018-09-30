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

export class Semaphore
implements C.Semaphore.IObject {

    private _currency: number;

    private _key: string;

    private _driver: C.Semaphore.IDriver;

    public constructor(
        currency: number,
        key: string,
        driver: C.Semaphore.IDriver
    ) {

        this._currency = currency;
        this._key = key;
        this._driver = driver;
    }

    public get currency(): number {

        return this._currency;
    }

    public get key(): string {

        return this._key;
    }

    public enter(timeout?: number): string | false | Promise<string | false> {

        return this._driver.enter(
            this._key,
            this._currency,
            timeout
        );
    }

    public leave(handle: string): boolean | Promise<boolean> {

        return this._driver.leave(
            this._key,
            handle
        );
    }

    public reset(): boolean | Promise<boolean> {

        return this._driver.reset(this._key, this._currency);
    }
}

export default Semaphore;
