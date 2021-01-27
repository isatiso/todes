import { BaseClient } from './lib/client'
import { Command } from './lib/command'
import { RedisType as R } from './lib/type'
import { RedisClientParams } from './redis-client.type'

export class RedisHashClient extends BaseClient {

    /**
     * [[include:hash/hdel.md]]
     *
     * @category Hash
     * @param key
     * @param fields 需要移除的 field 列表。
     * @return
     */
    hdel(key: R.Key, ...fields: [R.Field, ...R.Field[]]) {
        return this.send_command(new Command<R.NatureNumber>('HDEL', [key, ...fields]))
    }

    /**
     * [[include:hash/hexists.md]]
     *
     * @category Hash
     * @param key
     * @param field
     * @return
     */
    hexists(key: R.Key, field: R.Field) {
        return this.send_command(new Command<0 | 1>('HEXISTS', [key, field]))
    }

    /**
     * [[include:hash/hget.md]]
     *
     * @category Hash
     * @param key
     * @param field
     * @return
     */
    hget(key: R.Key, field: R.Field): Promise<string | null>
    /**
     * [[include:hash/hget.md]]
     *
     * @param key
     * @param field
     * @param return_buffer 是否以 Buffer 形式返回结果。
     * @return
     */
    hget(key: R.Key, field: R.Field, return_buffer: true): Promise<Buffer | null>
    hget(key: R.Key, field: R.Field, return_buffer?: boolean) {
        return this.send_command(new Command<R.StringValue | null>('HGET', [key, field], { return_buffer }))
    }

    /**
     * [[include:hash/hgetall.md]]
     *
     * @category Hash
     * @param key
     * @return
     */
    hgetall(key: R.Key): Promise<{ [field: string]: string }>
    /**
     * [[include:hash/hgetall.md]]
     *
     * @param key
     * @param return_buffer
     * @return
     */
    hgetall(key: R.Key, return_buffer: true): Promise<{ [field: string]: Buffer }>
    hgetall(key: R.Key, return_buffer?: boolean) {
        return this.send_command(new Command<string[], { [field: string]: R.StringValue }>('HGETALL', [key], undefined, (data: string[]) => {
            const res: any = {}
            for (let i = 0; i < data.length; i += 2) {
                res[data[i].toString()] = data[i + 1]
            }
            return res
        }))
    }

    /**
     * [[include:hash/hincrby.md]]
     *
     * @category Hash
     * @param key
     * @param field
     * @param increment
     * @return
     */
    hincrby(key: R.Key, field: R.Field, increment: R.Integer) {
        return this.send_command(new Command<R.Integer>('HINCRBY', [key, field, increment + '']))
    }

    /**
     * [[include:hash/hincrbyfloat.md]]
     *
     * @category Hash
     * @param key
     * @param field
     * @param increment
     * @return
     */
    hincrbyfloat(key: R.Key, field: R.Field, increment: R.StringDoubleValue) {
        return this.send_command(new Command<R.StringDoubleValue>('HINCRBYFLOAT', [key, field, increment + '']))
    }

    /**
     * [[include:hash/hkeys.md]]
     *
     * @category Hash
     * @param key
     * @return
     */
    hkeys(key: R.Key) {
        return this.send_command(new Command<R.Field[]>('HKEYS', [key]))
    }

    /**
     * [[include:hash/hlen.md]]
     *
     * @category Hash
     * @param key
     * @return
     */
    hlen(key: R.Key) {
        return this.send_command(new Command<R.NatureNumber>('HLEN', [key]))
    }

    /**
     * [[include:hash/hmget.md]]
     *
     * @category Hash
     * @param key
     * @param fields 需要请求的 field 列表。
     * @return
     */
    hmget(key: R.Key, fields: [R.Field, ...R.Field[]]): Promise<Array<string | null>>
    /**
     * [[include:hash/hmget.md]]
     *
     * @param key
     * @param fields 需要请求的 field 列表。
     * @param return_buffer 以 Buffer 形式返回结果。
     * @return
     */
    hmget(key: R.Key, fields: [R.Field, ...R.Field[]], return_buffer: true): Promise<Array<Buffer | null>>
    hmget(key: R.Key, fields: [R.Field, ...R.Field[]], return_buffer?: boolean) {
        return this.send_command(new Command<Array<R.StringValue | null>>('HMGET', [key, ...fields]))
    }

    /**
     * [[include:hash/hmset.md]]
     *
     * @category Hash
     * @param key
     * @param kvs
     * @return
     */
    hmset(key: R.Key, kvs: { [key: string]: string }) {
        const args = [key]
        Object.entries(kvs).forEach(([k, v]) => args.push(k, v))
        return this.send_command(new Command<'OK', 'OK'>('HMSET', args))
    }

    /**
     * [[include:hash/hscan.md]]
     *
     * @category Hash
     * @param key
     * @param cursor
     * @param options
     * @return
     */
    hscan(key: R.Key, cursor: number, options?: RedisClientParams.HScanOptions) {
        const args = [key, cursor + '']
        if (options?.match) {
            args.push('MATCH', options.match)
        }
        if (options?.count) {
            args.push('COUNT', options.count + '')
        }
        return this.send_command(new Command<R.KeyCount>('HSCAN', args))
    }

    /**
     * [[include:hash/hset.md]]
     *
     * @category Hash
     * @param key
     * @param kvs
     * @return
     */
    hset(key: R.Key, kvs: { [key: string]: R.StringValue }) {
        const args: R.StringValue[] = [key]
        Object.entries(kvs).forEach(([k, v]) => args.push(k, v))
        return this.send_command(new Command<R.Bit>('HSET', args))
    }

    /**
     * [[include:hash/hsetnx.md]]
     *
     * @category Hash
     * @param key
     * @param field
     * @param value
     * @return
     */
    hsetnx(key: R.Key, field: R.Field, value: R.StringValue) {
        return this.send_command(new Command<R.Bit>('HSETNX', [key, field, value]))
    }

    /**
     * [[include:hash/hstrlen.md]]
     *
     * @category Hash
     * @param key
     * @param field
     * @return
     */
    hstrlen(key: R.Key, field: R.Field) {
        return this.send_command(new Command<R.NatureNumber>('HSTRLEN', [key, field]))
    }

    /**
     * [[include:hash/hvals.md]]
     *
     * @category Hash
     * @param key
     * @return
     */
    hvals(key: R.Key): Promise<string[]>
    /**
     * [[include:hash/hvals.md]]
     *
     * @param key
     * @param return_buffer 以 Buffer 形式返回结果。
     * @return
     */
    hvals(key: R.Key, return_buffer: true): Promise<Buffer[]>
    hvals(key: R.Key, return_buffer?: boolean) {
        return this.send_command(new Command<R.StringValue[]>('HVALS', [key], { return_buffer }))
    }
}
