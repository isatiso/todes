/**
 * Generic commands for Redis.
 *
 * @packageDocumentation
 * @module RedisGenericClient
 */

import { BaseClient } from './lib/client'
import { Command } from './lib/command'
import { RedisType as R } from './lib/type'
import { RedisClientParams } from './redis-client.type'

export class RedisGenericClient extends BaseClient {

    /**
     * [[include:generic/copy.md]]
     *
     * @category Generic
     * @param source
     * @param destination
     * @return
     *
     * *[查看原始定义](https://redis.io/commands/copy)*
     */
    copy(source: R.Key, destination: R.Key): Promise<0 | 1>
    /**
     * [[include:generic/copy.md]]
     *
     * @param source
     * @param destination
     * @param db destination key 如果不在当前 db，则需要提供新的 db 号。
     * @return
     *
     * *[查看原始定义](https://redis.io/commands/copy)*
     */
    copy(source: R.Key, destination: R.Key, db: R.Db): Promise<0 | 1>
    /**
     * [[include:generic/copy.md]]
     *
     * @param source
     * @param destination
     * @param replace 是否添加 REPLACE 标签。
     * @return
     *
     * *[查看原始定义](https://redis.io/commands/copy)*
     */
    copy(source: R.Key, destination: R.Key, replace: boolean): Promise<0 | 1>
    /**
     * [[include:generic/copy.md]]
     *
     * @param source
     * @param destination
     * @param db destination key 如果不在当前 db，则需要提供新的 db 号。
     * @param replace 是否添加 REPLACE 标签。
     * @return
     *
     * *[查看原始定义](https://redis.io/commands/copy)*
     */
    copy(source: R.Key, destination: R.Key, db: R.Db, replace: boolean): Promise<0 | 1>
    copy(source: R.Key, destination: R.Key, db?: R.Db | boolean, replace?: boolean) {
        const args = [source, destination]
        if (typeof db === 'number') {
            args.push(db + '')
        }
        if (typeof db === 'boolean' || replace) {
            args.push('REPLACE')
        }
        return this.send_command(new Command<0 | 1>('COPY', args))
    }

    /**
     * [[include:generic/del.md]]
     *
     * @category Generic
     * @param keys 需要删除的 key 列表。
     * @return
     *
     * *[查看原始定义](https://redis.io/commands/del)*
     */
    del(...keys: [R.Key, ...R.Key[]]) {
        return this.send_command(new Command<R.KeyCount>('DEL', [...keys]))
    }

    /**
     * [[include:generic/dump.md]]
     *
     * @category Generic
     * @param key
     * @return
     *
     * *[查看原始定义](https://redis.io/commands/dump)*
     */
    dump(key: R.Key) {
        return this.send_command(new Command<R.KeyCount>('DUMP', [key]))
    }

    /**
     * [[include:generic/exists.md]]
     *
     * @category Generic
     * @param keys 需要检查的 key。**3.0.3** 版本开始支持传递多个 key。
     * @return
     *
     * *[查看原始定义](https://redis.io/commands/exists)*
     */
    exists(...keys: [R.Key, ...R.Key[]]) {
        return this.send_command(new Command<R.KeyCount>('EXISTS', [...keys]))
    }

    /**
     * [[include:generic/expire.md]]
     *
     * @category Generic
     * @param key
     * @param ttl 需要设置的超时时间。
     * @return
     *
     * *[查看原始定义](https://redis.io/commands/expire)*
     */
    expire(key: R.Key, ttl: R.TTL) {
        return this.send_command(new Command<0 | 1>('EXPIRE', [key, ttl + '']))
    }

    /**
     * [[include:generic/expireat.md]]
     *
     * @category Generic
     * @param key
     * @param timestamp 需要设置的过期时间戳。
     * @return
     *
     * *[查看原始定义](https://redis.io/commands/expireat)*
     */
    expireat(key: R.Key, timestamp: R.Timestamp) {
        return this.send_command(new Command<0 | 1>('EXPIREAT', [key, timestamp + '']))
    }

    /**
     * [[include:generic/keys.md]]
     *
     * @category Generic
     * @param pattern glob 风格匹配模式。
     * @return
     *
     * *[查看原始定义](https://redis.io/commands/keys)*
     */
    keys(pattern: R.KeyPattern) {
        return this.send_command(new Command<R.Key[]>('KEYS', [pattern]))
    }

    /**
     * [[include:generic/migrate.md]]
     *
     * @category Generic
     * @param host 目标实例地址。
     * @param port 目标实例端口号。
     * @param keys 需要传输的 key 列表，在 3.0.6 以上的版本可以支持多个 key 传输。
     * @param destination_db 目标实例的数据库。
     * @param timeout 超时时间，单位毫秒。
     * @param options 选项
     * @return
     *
     * *[查看原始定义](https://redis.io/commands/migrate)*
     */
    migrate(host: string, port: number, keys: [R.Key, ...R.Key[]], destination_db: number, timeout: number, options?: RedisClientParams.MigrateOptions) {
        const key = keys.length > 1 ? '' : keys[0]
        const args = [host, port + '', key, destination_db + '', timeout + '']
        if (options?.copy) {
            args.push('COPY')
        }
        if (options?.replace) {
            args.push('REPLACE')
        }
        if (options?.auth) {
            if (options.auth.username) {
                args.push('AUTH2', options.auth.username, options.auth.password)
            } else {
                args.push('AUTH', options.auth.password)
            }
        }
        if (key === '') {
            args.push('KEYS', ...keys)
        }
        return this.send_command(new Command<'OK' | 'NOKEY'>('MIGRATE', args))
    }

    /**
     * [[include:generic/move.md]]
     *
     * @category Generic
     * @param key
     * @param db
     * @return
     *
     * *[查看原始定义](https://redis.io/commands/move)*
     */
    move(key: R.Key, db: number) {
        return this.send_command(new Command<R.Bit>('MOVE', [key, db + '']))
    }

    /**
     * [[include:generic/object.md]]
     *
     * **调试命令：**返回与指定 key 关联的值的引用计数。
     *
     * @category Generic
     * @param subcommand
     * @param key
     * @return
     *
     * *[查看原始定义](https://redis.io/commands/object)*
     */
    object(subcommand: 'REFCOUNT', key: R.Key): Promise<number | null>
    /**
     * [[include:generic/object.md]]
     *
     * 返回用于存储与键关联的值的内部表示形式的类型。
     *
     * - **string** 可以编码为 raw（常规字符串编码），embstr （专门用于保存短字符串）或 int（以64位有符号间隔表示整数的字符串以这种方式编码，以节省空间）。
     * - **list** 可以编码为 ziplist 或 linkedlist。ziplist是一种特殊的表示形式，用于节省小 **list** 的空间。
     * - **set** 可以编码为 intset 或 hashtable。intset 是一种特殊的编码，用于仅由整数组成的小 **set**。
     * - **hash** 可以编码为 ziplist 或 hashtable。ziplist 是用于小 **hash** 的特殊编码。
     * - **zset** 可以编码为 ziplist 或 skiplist 格式。ziplist 适用于小的 **list** 和 **zset**，skiplist 编码则适用于任何大小的 **zset**。
     *
     * @param subcommand
     * @param key
     * @return
     *
     * *[查看原始定义](https://redis.io/commands/object)*
     */
    object(subcommand: 'ENCODING', key: R.Key): Promise<R.RedisValueEncoding | null>
    /**
     * [[include:generic/object.md]]
     *
     * 返回指定 key 处的对象自存储以来处于空闲状态的秒数（读或写操作未请求）。
     * 虽然以秒为单位返回该值，但此计时器的实际分辨率为 10 秒，这在将来的实现中可能会有所不同。
     * 当 maxmemory-policy 设置为 LRU 策略或 noeviction 并且设置了 maxmemory 时，此子命令可用。
     *
     * @param subcommand
     * @param key
     * @return
     *
     * *[查看原始定义](https://redis.io/commands/object)*
     */
    object(subcommand: 'IDLETIME', key: R.Key): Promise<number | null>
    /**
     * [[include:generic/object.md]]
     *
     * 返回存储在指定键处的对象的对数访问频率计数器。
     * 当 maxmemory-policy 设置为 LFU 策略时，此子命令可用。
     *
     * @param subcommand
     * @param key
     * @return
     *
     * *[查看原始定义](https://redis.io/commands/object)*
     */
    object(subcommand: 'FREQ', key: R.Key): Promise<number | null>
    /**
     * [[include:generic/object.md]]
     *
     * 返回 OBJECT 命令的一个简洁说明。
     *
     * @param subcommand
     * @return
     *
     * *[查看原始定义](https://redis.io/commands/object)*
     */
    object(subcommand: 'HELP'): Promise<string>
    object(subcommand: 'REFCOUNT' | 'ENCODING' | 'IDLETIME' | 'FREQ' | 'HELP', key?: R.Key) {
        const args: string[] = [subcommand]
        if (key) {
            args.push(key)
        }
        return this.send_command(new Command<number | string | null>('OBJECT', args))
    }

    /**
     * [[include:generic/persist.md]]
     *
     * @category Generic
     * @param key
     * @return
     *
     * *[查看原始定义](https://redis.io/commands/persist)*
     */
    persist(key: R.Key) {
        return this.send_command(new Command<0 | 1>('PERSIST', [key]))
    }

    /**
     * [[include:generic/pexpire.md]]
     *
     * @category Generic
     * @param key
     * @param ttl 需要设置的超时时间，单位毫秒。
     * @return
     *
     * *[查看原始定义](https://redis.io/commands/pexpire)*
     */
    pexpire(key: R.Key, ttl: R.PTTL) {
        return this.send_command(new Command<R.Bit>('PEXPIRE', [key, ttl + '']))
    }

    /**
     * [[include:generic/pexpireat.md]]
     *
     * @category Generic
     * @param key
     * @param timestamp 需要设置的过期时间戳，单位毫秒。
     * @return
     *
     * *[查看原始定义](https://redis.io/commands/pexpireat)*
     */
    pexpireat(key: R.Key, timestamp: R.MilliTimestamp) {
        return this.send_command(new Command<R.Bit>('PEXPIREAT', [key, timestamp + '']))
    }

    /**
     * [[include:generic/pttl.md]]
     *
     * @category Generic
     * @param key
     * @return
     *
     * *[查看原始定义](https://redis.io/commands/pttl)*
     */
    pttl(key: R.Key) {
        return this.send_command(new Command<R.PTTL>('PTTL', [key]))
    }

    /**
     * [[include:generic/randomkey.md]]
     *
     * @category Generic
     * @return
     *
     * *[查看原始定义](https://redis.io/commands/randomkey)*
     */
    randomkey() {
        return this.send_command(new Command<R.Key | null>('RANDOMKEY', []))
    }

    /**
     * [[include:generic/rename.md]]
     *
     * @category Generic
     * @param key
     * @param newkey
     * @return
     *
     * *[查看原始定义](https://redis.io/commands/rename)*
     */
    rename(key: R.Key, newkey: R.Key) {
        return this.send_command(new Command<'OK'>('RENAME', [key, newkey]))
    }

    /**
     * [[include:generic/renamenx.md]]
     *
     * @category Generic
     * @param key
     * @param newkey
     * @return
     *
     * *[查看原始定义](https://redis.io/commands/renamenx)*
     */
    renamenx(key: R.Key, newkey: R.Key) {
        return this.send_command(new Command<0 | 1>('RENAMENX', [key, newkey]))
    }

    /**
     * [[include:generic/restore.md]]
     *
     * @category Generic
     * @param key
     * @param ttl
     * @param serialized_value
     * @param options
     * @return
     *
     * *[查看原始定义](https://redis.io/commands/restore)*
     */
    restore(key: R.Key, ttl: R.TTL, serialized_value: string, options?: RedisClientParams.RestoreOptions) {
        const args = [key, ttl + '', serialized_value]
        if (options?.replace) {
            args.push('REPLACE')
        }
        if (options?.absttl) {
            args.push('ABSTTL')
        }
        if (options?.idletime !== undefined) {
            args.push('IDLETIME', options.idletime + '')
        }
        if (options?.freq !== undefined) {
            args.push('FREQ', options.freq + '')
        }
        return this.send_command(new Command<0 | 1>('RESTORE', args))
    }

    /**
     * [[include:generic/sort.md]]
     *
     * @category Generic
     * @param key
     * @return
     *
     * *[查看原始定义](https://redis.io/commands/sort)*
     */
    sort(key: R.Key): Promise<string[]>
    /**
     * [[include:generic/sort.md]]
     *
     * @param key
     * @param store 指定 key 用来存储排序结果。当指定的 key 已经存在时，会被覆盖。
     * @return
     *
     * *[查看原始定义](https://redis.io/commands/sort)*
     */
    sort(key: R.Key, store: R.Key): Promise<string[]>
    /**
     * [[include:generic/sort.md]]
     *
     * @param key
     * @param options
     * @return
     *
     * *[查看原始定义](https://redis.io/commands/sort)*
     */
    sort(key: R.Key, options: RedisClientParams.SortOptions): Promise<string[]>
    /**
     * [[include:generic/sort.md]]
     *
     * @param key
     * @param store 指定 key 用来存储排序结果。当指定的 key 已经存在时，会被覆盖。
     * @param options
     * @return
     *
     * *[查看原始定义](https://redis.io/commands/sort)*
     */
    sort(key: R.Key, store: R.Key, options: RedisClientParams.SortOptions): Promise<string[]>
    sort(key: R.Key, store?: R.Key | RedisClientParams.SortOptions, options?: RedisClientParams.SortOptions) {
        const args = [key]
        if (typeof store !== 'string') {
            options = store
            store = undefined
        }
        if (options?.by) {
            args.push('BY', options.by)
        }
        if (options?.limit) {
            args.push('LIMIT', options.limit[0] + '', options.limit[1] + '')
        }
        if (options?.get) {
            options?.get.forEach(pattern => args.push('GET', pattern))
        }
        if (options?.desc) {
            args.push('DESC')
        }
        if (options?.alpha) {
            args.push('ALPHA')
        }
        if (store) {
            args.push('STORE', store)
        }
        return this.send_command(new Command<string[]>('SORT', args))
    }

    /**
     * [[include:generic/touch.md]]
     *
     * @category Generic
     * @param keys
     * @return
     *
     * *[查看原始定义](https://redis.io/commands/touch)*
     */
    touch(...keys: [R.Key, ...R.Key[]]) {
        return this.send_command(new Command<string[]>('TOUCH', keys))
    }

    /**
     * [[include:generic/ttl.md]]
     *
     * @category Generic
     * @param key
     * @return
     *
     * *[查看原始定义](https://redis.io/commands/ttl)*
     */
    ttl(key: R.Key) {
        return this.send_command(new Command<R.TTL>('TTL', [key]))
    }

    /**
     * [[include:generic/type.md]]
     *
     * @category Generic
     * @param key
     * @return
     *
     * *[查看原始定义](https://redis.io/commands/type)*
     */
    type(key: R.Key) {
        return this.send_command(new Command<R.RedisValueType | 'none'>('TYPE', [key]))
    }

    /**
     * [[include:generic/unlink.md]]
     *
     * @category Generic
     * @param keys
     * @return
     *
     * *[查看原始定义](https://redis.io/commands/unlink)*
     */
    unlink(...keys: [R.Key, ...R.Key[]]) {
        return this.send_command(new Command<R.KeyCount>('UNLINK', keys))
    }

    /**
     * [[include:generic/wait.md]]
     *
     * TODO: 补命令说明。
     *
     * @category Generic
     * @param numreplicas
     * @param timeout 单位毫秒
     * @return
     *
     * *[查看原始定义](https://redis.io/commands/wait)*
     */
    wait(numreplicas: number, timeout: number) {
        return this.send_command(new Command<R.KeyCount>('WAIT', [numreplicas + '', timeout + '']))
    }

    /**
     * [[include:generic/scan.md]]
     *
     * @category Generic
     * @param cursor
     * @param options
     * @return
     *
     * *[查看原始定义](https://redis.io/commands/scan)*
     */
    scan(cursor: number, options?: RedisClientParams.ScanOptions) {
        const args = [cursor + '']
        if (options?.match) {
            args.push('MATCH', options.match)
        }
        if (options?.count) {
            args.push('COUNT', options.count + '')
        }
        if (options?.type) {
            args.push('TYPE', options.type)
        }
        return this.send_command(new Command<R.KeyCount>('SCAN', args))
    }
}
