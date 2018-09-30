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

interface IHandle {

    handle: string;

    expiringAt?: number;
}

export class InMemoryDriver
implements C.Semaphore.IDriver {

    private _counter: number;

    private _items: Record<string, Record<string, IHandle>>;

    public constructor() {

        this._items = {};

        this._counter = 0;
    }

    public close(): void {

        return;
    }

    public enter(
        key: string,
        currency: number,
        timeout?: number
    ): string | false | Promise<string | false> {

        const NOW = Date.now();

        let item = this._items[key];

        if (!item) {

            item = {};
        }

        for (const k in item) {

            const h = item[k];

            if (h.expiringAt && h.expiringAt < NOW) {

                delete item[k];
            }
        }

        if (Object.keys(item).length === currency) {

            return false;
        }

        const handle = (this._counter += 1 + Math.random()).toString();

        item[handle] = {
            "handle": handle,
            "expiringAt": timeout ? NOW + timeout : 0
        };

        this._items[key] = item;

        return handle;
    }

    public leave(key: string, handle: string): boolean {

        let item = this._items[key];

        if (!item || !item[handle]) {

            return false;
        }

        delete item[handle];

        if (!Object.keys(item).length) {

            delete this._items[key];
        }
        else {

            this._items[key] = item;
        }

        return true;
    }

    public reset(key: string): boolean {

        delete this._items[key];

        return true;
    }
}
