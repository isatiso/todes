import { BaseClient } from './lib/client'
import { RedisClientOptions } from './lib/type'
import { RedisGenericClient } from './redis-generic-client'
import { RedisHashClient } from './redis-hash-client'
import { RedisListClient } from './redis-list-client'
import { RedisServerClient } from './redis-server-client'
import { RedisSetClient } from './redis-set-client'
import { RedisSortedSetClient } from './redis-sorted-set-client'
import { RedisStringClient } from './redis-string-client'

function applyMixins(derivedCtor: any, constructors: any[]) {
    constructors.forEach((baseCtor) => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
            if (name !== 'constructor' && derivedCtor.prototype.hasOwnProperty(name)) {
                throw new Error(`Property ${name} is duplicated in ${baseCtor.name}.`)
            } else {
                Object.defineProperty(
                    derivedCtor.prototype,
                    name,
                    Object.getOwnPropertyDescriptor(baseCtor.prototype, name) ||
                    Object.create(null)
                )
            }
        })
    })
}

/**
 * RedisClient 继承了其他一系列的 Client，相当于是一个合集。
 */
export class RedisClient extends BaseClient {
    constructor(options: RedisClientOptions) {
        super(options)
    }
}

export interface RedisClient extends RedisGenericClient,
    RedisHashClient,
    RedisListClient,
    RedisServerClient,
    RedisSetClient,
    RedisSortedSetClient,
    RedisStringClient {
}

applyMixins(RedisClient, [
    RedisGenericClient,
    RedisHashClient,
    RedisListClient,
    RedisServerClient,
    RedisSetClient,
    RedisSortedSetClient,
    RedisStringClient,
])
