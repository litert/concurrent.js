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

export namespace RateLimiter {

    export interface IObject {

        readonly currency: number;

        readonly period: number;

        readonly key: string;

        walk(step?: number): boolean | Promise<boolean>;

        reset(): boolean | Promise<boolean>;
    }

    export interface IOptions {

        currency: number;

        period: number;

        key: string;

        driver?: string;
    }

    export interface IDriver {

        walk(
            key: string,
            step: number,
            currency: number,
            period: number
        ): Promise<boolean> | boolean;

        reset(
            key: string,
            currency: number,
            period: number
        ): Promise<boolean> | boolean;

        close(): Promise<void> | void;
    }
}

export namespace Semaphore {

    export interface IObject {

        readonly currency: number;

        readonly key: string;

        enter(timeout?: number): string | false | Promise<string | false>;

        leave(handle: string): boolean | Promise<boolean>;

        reset(): boolean | Promise<boolean>;
    }

    export interface IOptions {

        currency: number;

        key: string;

        driver?: string;
    }

    export interface IDriver {

        enter(
            key: string,
            currency: number,
            timeout?: number
        ): string | false | Promise<string | false>;

        leave(
            key: string,
            handle: string
        ): Promise<boolean> | boolean;

        reset(
            key: string,
            currency: number
        ): Promise<boolean> | boolean;

        close(): Promise<void> | void;
    }
}

export interface IFactory {

    registerDriver(
        type: "rate_limiter",
        name: string,
        driver: RateLimiter.IDriver,
        asDefault?: boolean
    ): this;

    registerDriver(
        type: "semaphore",
        name: string,
        driver: Semaphore.IDriver,
        asDefault?: boolean
    ): this;

    getDriver<T extends RateLimiter.IDriver = RateLimiter.IDriver>(
        type: "rate_limiter",
        name: string
    ): T;

    getDriver<T extends Semaphore.IDriver = Semaphore.IDriver>(
        type: "semaphore",
        name: string
    ): T;

    unregisterDriver(
        type: "rate_limiter" | "semaphore",
        name: string
    ): Promise<void> | void;

    createRateLimiter(opts: RateLimiter.IOptions): RateLimiter.IObject;

    createSemaphore(opts: Semaphore.IOptions): Semaphore.IObject;
}
