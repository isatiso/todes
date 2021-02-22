/**
 * Generic commands for Redis.
 *
 * @packageDocumentation
 * @module RedisGenericClient
 */

import { BaseClient } from './lib/client'
import { Command } from './lib/command'
import { RedisType as R } from './lib/type'
import { RedisClientParams as RParams } from './redis-client.type'

export class RedisGenericClient extends BaseClient {

    /**
     * [[include:generic/copy.md]]
     *
     * @category Generic
     * @param source
     * @param destination
     * @return
     */
    copy(source: R.Key, destination: R.Key): Promise<0 | 1>
    /**
     * [[include:generic/copy.md]]
     *
     * @param source
     * @param destination
     * @param db 默认将 destination 创建在当前 db，如果需要更换 db 可以使用此选项。
     * @return
     */
    copy(source: R.Key, destination: R.Key, db: R.Db): Promise<0 | 1>
    /**
     * [[include:generic/copy.md]]
     *
     * @param source
     * @param destination
     * @param replace 是否添加 REPLACE 标签。
     * @return
     */
    copy(source: R.Key, destination: R.Key, replace: boolean): Promise<0 | 1>
    /**
     * [[include:generic/copy.md]]
     *
     * @param source
     * @param destination
     * @param db 默认将 destination 创建在当前 db，如果需要更换 db 可以使用此选项。
     * @param replace 是否添加 REPLACE 标签。
     * @return
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
     */
    dump(key: R.Key) {
        return this.send_command(new Command<Buffer>('DUMP', [key], { return_buffer: true }))
    }

    /**
     * [[include:generic/exists.md]]
     *
     * @category Generic
     * @param keys 需要检查的 key。**3.0.3** 版本开始支持传递多个 key。
     * @return
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
     */
    keys(pattern: R.KeyPattern): Promise<string[]>
    /**
     * [[include:generic/keys.md]]
     *
     * @category Generic
     * @param pattern glob 风格匹配模式。
     * @param return_buffer 是否以 Buffer 形式返回结果。
     * @return
     */
    keys(pattern: R.KeyPattern, return_buffer: true): Promise<Buffer[]>
    keys(pattern: R.KeyPattern, return_buffer?: boolean) {
        return this.send_command(new Command<R.Key[]>('KEYS', [pattern], { return_buffer }))
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
     */
    migrate(host: string, port: number, keys: [R.Key, ...R.Key[]], destination_db: number, timeout: number, options?: RParams.MigrateOptions) {
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
     */
    object(subcommand: 'REFCOUNT', key: R.Key): Promise<number | null>
    /**
     * [[include:generic/object.md]]
     *
     * 返回用于存储与键关联的值的内部表示形式的类型。
     *
     * @param subcommand
     * @param key
     * @return
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
     */
    object(subcommand: 'FREQ', key: R.Key): Promise<number | null>
    /**
     * [[include:generic/object.md]]
     *
     * 返回 OBJECT 命令的一个简洁说明。
     *
     * @param subcommand
     * @return
     */
    object(subcommand: 'HELP'): Promise<string>
    object(subcommand: 'REFCOUNT' | 'ENCODING' | 'IDLETIME' | 'FREQ' | 'HELP', key?: R.Key) {
        const args: R.StringValue[] = [subcommand]
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
     */
    pttl(key: R.Key) {
        return this.send_command(new Command<R.PTTL>('PTTL', [key]))
    }

    /**
     * [[include:generic/randomkey.md]]
     *
     * @category Generic
     * @return
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
     */
    restore(key: R.Key, ttl: R.TTL, serialized_value: Buffer, options?: RParams.RestoreOptions) {
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
     * [[include:generic/scan.md]]
     *
     * @category Generic
     * @param cursor
     * @param options
     * @return
     */
    scan(cursor: number | string, options?: RParams.ScanOptions): Promise<RParams.ScanResult<string>>
    /**
     * [[include:generic/scan.md]]
     *
     * @category Generic
     * @param cursor
     * @param return_buffer 以 Buffer 形式返回结果。
     * @param options
     * @return
     */
    scan(cursor: number | string, return_buffer: true, options?: RParams.ScanOptions): Promise<RParams.ScanResult<Buffer>>
    scan(cursor: number | string, return_buffer?: boolean | RParams.ScanOptions, options?: RParams.ScanOptions) {
        const args: Array<R.StringValue> = [cursor + '']
        if (typeof return_buffer !== 'boolean') {
            options = return_buffer
            return_buffer = false
        }
        if (options?.match) {
            args.push('MATCH', options.match)
        }
        if (options?.count) {
            args.push('COUNT', options.count + '')
        }
        if (options?.type) {
            args.push('TYPE', options.type)
        }
        return this.send_command(new Command<[string, string[]], RParams.ScanResult<string | Buffer>>(
            'SCAN', args, { return_buffer },
            res => ({ keys: res[1], cursor: Buffer.isBuffer(res[0]) ? res[0].toString() : res[0] as string })
        ))
    }

    /**
     * [[include:generic/sort.md]]
     *
     * @category Generic
     * @param key
     * @return
     */
    sort(key: R.Key): Promise<string[]>
    /**
     * [[include:generic/sort.md]]
     *
     * @param key
     * @param store 指定 key 用来存储排序结果。当指定的 key 已经存在时，会被覆盖。
     * @return
     */
    sort(key: R.Key, store: R.Key): Promise<string[]>
    /**
     * [[include:generic/sort.md]]
     *
     * @param key
     * @param options
     * @return
     */
    sort(key: R.Key, options: RParams.SortOptions): Promise<string[]>
    /**
     * [[include:generic/sort.md]]
     *
     * @param key
     * @param store 指定 key 用来存储排序结果。当指定的 key 已经存在时，会被覆盖。
     * @param options
     * @return
     */
    sort(key: R.Key, store: R.Key, options: RParams.SortOptions): Promise<string[]>
    sort(key: R.Key, store?: R.Key | RParams.SortOptions, options?: RParams.SortOptions) {
        const args = [key]
        if (typeof store !== 'string' && !Buffer.isBuffer(store)) {
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

}
