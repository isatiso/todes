import { BaseClient } from './lib/client'
import { Command } from './lib/command'
import { RedisType as R } from './lib/type'

export class RedisHashClient extends BaseClient {

    /**
     * [[include:hash/hdel.md]]
     *
     * @category List
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
     * @category List
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
     * @category List
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
     * @category List
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
     * @category List
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
     * @category List
     * @param key
     * @param field
     * @param increment
     * @return
     */
    hincrbyfloat(key: R.Key, field: R.Field, increment: R.StringDoubleValue) {
        return this.send_command(new Command<R.StringDoubleValue>('HINCRBYFLOAT', [key, field, increment + '']))
    }

    /**
     * [[include:hash/hset.md]]
     *
     * @category List
     * @param key
     * @param kvs
     * @return
     */
    hset(key: R.Key, kvs: { [key: string]: R.StringValue }) {
        const args: R.StringValue[] = [key]
        Object.entries(kvs).forEach(([k, v]) => args.push(k, v))
        return this.send_command(new Command<R.Bit>('HSET', args))
    }

    hsetnx(key: R.Key, field: R.Field, value: R.StringValue) {
        return this.send_command(new Command<R.Bit>('HSETNX', [key, field, value]))
    }

    hkeys(key: R.Key) {
        return this.send_command(new Command<R.Field[]>('HKEYS', [key]))
    }

    hvals(key: R.Key) {
        return this.send_command(new Command<R.StringValue[]>('HVALS', [key]))
    }

    hlen(key: R.Key) {
        return this.send_command(new Command<R.NatureNumber>('HLEN', [key]))
    }

    hstrlen(key: R.Key, field: R.Field) {
        return this.send_command(new Command<R.NatureNumber>('HSTRLEN', [key, field]))
    }

    hmget(key: R.Key, fields: [R.Field, ...R.Field[]]): Promise<Array<string | null>>
    hmget(key: R.Key, fields: [R.Field, ...R.Field[]], return_buffer: true): Promise<Array<Buffer | null>>
    hmget(key: R.Key, fields: [R.Field, ...R.Field[]], return_buffer?: boolean) {
        return this.send_command(new Command<Array<R.StringValue | null>>('HMGET', [key, ...fields]))
    }

    hmset(key: R.Key, kvs: { [key: string]: string }) {
        const args = [key]
        Object.entries(kvs).forEach(([k, v]) => args.push(k, v))
        return this.send_command(new Command<'OK', 'OK'>('HMSET', args))
    }



    // TODO: HSCAN‚

}
