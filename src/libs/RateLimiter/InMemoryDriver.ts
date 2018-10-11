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

export interface InMemoryOptions {

    gcInterval: number;

    gcSection: number;
}

interface IDetails {

    value: number;

    expiringAt: number;
}

export class InMemoryDriver
implements C.RateLimiter.IDriver {

    private _items: Record<string, IDetails>;

    private _gc: number;

    public constructor(opts?: Partial<InMemoryOptions>) {

        this._items = {};

        const options: InMemoryOptions = {
            "gcInterval": 5000,
            "gcSection": 1000
        };

        if (opts) {

            let k: keyof InMemoryOptions;

            for (k in options) {

                options[k] = opts[k] || options[k];
            }
        }

        this._gc = this._startGC(options.gcInterval, options.gcSection);
    }

    private _startGC(gcInterval: number, gcSection: number): number {

        return setInterval(() => {

            const NOW = Date.now();

            let i = 0;

            for (let k in this._items) {

                const item = this._items[k];

                if (item.expiringAt < NOW) {

                    delete this._items[k];

                    if (++i > gcSection) {

                        break;
                    }
                }
            }

        }, gcInterval);
    }

    public close(): void {

        if (this._gc) {

            clearInterval(this._gc);

            this._gc = 0;
        }
    }

    public walk(
        key: string,
        step: number,
        currency: number,
        period: number
    ): boolean {

        let item = this._items[key];
        let isExpired = false;

        const NOW = Date.now();

        if (!item) {

            item = {
                value: 0,
                expiringAt: NOW + period
            };
        }
        else {

            isExpired = item.expiringAt < NOW;

            if (isExpired) {

                item.value = 0;
                item.expiringAt = NOW + period;
            }
        }

        const v = item.value + step;

        if (v > currency) {

            if (isExpired) {

                delete this._items[key];
            }

            return false;
        }

        item.value = v;

        if (isExpired) {

            item.expiringAt = NOW + period;
        }

        this._items[key] = item;

        return true;
    }

    public reset(key: string): boolean {

        delete this._items[key];

        return true;
    }
}
