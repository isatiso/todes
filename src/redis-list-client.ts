import { BaseClient } from './lib/client'
import { Command } from './lib/command'
import { RedisType as R } from './lib/type'
import { RedisClientParams } from './redis-client.type'

export class RedisListClient extends BaseClient {

    /**
     * [[include:list/blmove.md]]
     *
     * @category List
     * @param src 需要 pop 元素的 list。
     * @param dest 需要 push 元素的 list。
     * @param src_direct 取出方向，LEFT 相当于 lpop，RIGHT 相当于 rpop。
     * @param dest_direct 推入方向，LEFT 相当于 lpush，RIGHT 相当于 rpush。
     * @param timeout 以秒为单位的过期时间，双精度浮点数。
     * @return
     */
    blmove(src: R.Key, dest: R.Key, src_direct: 'LEFT' | 'RIGHT', dest_direct: 'LEFT' | 'RIGHT', timeout: number): Promise<string | null>
    /**
     * [[include:list/blmove.md]]
     *
     * @param src 需要 pop 元素的 list。
     * @param dest 需要 push 元素的 list。
     * @param src_direct 取出方向，LEFT 相当于 lpop，RIGHT 相当于 rpop。
     * @param dest_direct 推入方向，LEFT 相当于 lpush，RIGHT 相当于 rpush。
     * @param timeout 以秒为单位的过期时间，双精度浮点数。
     * @param return_buffer 以 Buffer 形式返回结果。
     * @return
     */
    blmove(src: R.Key, dest: R.Key, src_direct: 'LEFT' | 'RIGHT', dest_direct: 'LEFT' | 'RIGHT', timeout: number, return_buffer: true): Promise<Buffer | null>
    blmove(src: R.Key, dest: R.Key, src_direct: 'LEFT' | 'RIGHT', dest_direct: 'LEFT' | 'RIGHT', timeout: number, return_buffer?: boolean) {
        return this.send_command(new Command<R.StringValue | null>('BLMOVE', [src, dest, src_direct, dest_direct, timeout + ''], { return_buffer }))
    }


    blpop(timeout: number, keys: [R.Key, ...R.Key[]]): Promise<[R.Key, string]>
    blpop(timeout: number, keys: [R.Key, ...R.Key[]], return_buffer: true): Promise<[Buffer, Buffer]>
    blpop(timeout: number, keys: [R.Key, ...R.Key[]], return_buffer?: boolean) {
        return this.send_command(new Command<[R.StringValue, R.StringValue] | null>('BLPOP', [...keys, timeout + ''], { return_buffer }))
    }

    brpop(timeout: number, keys: [R.Key, ...R.Key[]]): Promise<[R.Key, string] | null>
    brpop(timeout: number, keys: [R.Key, ...R.Key[]], return_buffer: true): Promise<[Buffer, Buffer] | null>
    brpop(timeout: number, keys: [R.Key, ...R.Key[]], return_buffer?: boolean) {
        return this.send_command(new Command<[R.StringValue, R.StringValue] | null>('BRPOP', [...keys, timeout + ''], { return_buffer }))
    }

    brpoplpush(source: R.Key, destination: R.Key, timeout: R.NatureNumber): Promise<string | null>
    brpoplpush(source: R.Key, destination: R.Key, timeout: R.NatureNumber, return_buffer: true): Promise<Buffer | null>
    brpoplpush(source: R.Key, destination: R.Key, timeout: R.NatureNumber, return_buffer?: boolean) {
        return this.send_command(new Command<R.StringValue | null>('BRPOPLPUSH', [source, destination, timeout + ''], { return_buffer }))
    }

    /**
     * [[include:list/lindex.md]]
     *
     * @category List
     * @param key
     * @param index
     * @return
     */
    lindex(key: R.Key, index: R.Integer): Promise<string | null>
    /**
     * [[include:list/lindex.md]]
     *
     * @param key
     * @param index
     * @param return_buffer 以 Buffer 形式返回结果。
     * @return
     */
    lindex(key: R.Key, index: R.Integer, return_buffer: true): Promise<Buffer | null>
    lindex(key: R.Key, index: R.Integer, return_buffer?: boolean) {
        return this.send_command(new Command<R.StringValue | null>('LINDEX', [key, index + ''], { return_buffer }))
    }

    /**
     * [[include:list/linsert.md]]
     *
     * @category List
     * @param key
     * @param pos
     * @param pivot
     * @param value
     * @return
     */
    linsert(key: R.Key, pos: 'BEFORE' | 'AFTER', pivot: R.StringValue, value: R.StringValue) {
        return this.send_command(new Command<R.NatureNumber | -1>('LINSERT', [key, pos, pivot, value]))
    }

    /**
     * [[include:list/llen.md]]
     *
     * @category List
     * @param key
     * @return
     */
    llen(key: R.Key) {
        return this.send_command(new Command<R.NatureNumber>('LLEN', [key]))
    }

    /**
     * [[include:list/lmove.md]]
     *
     * @category List
     * @param src 源列表
     * @param dest 存储列表
     * @param src_direct 源列表弹出方向，LEFT 相当于 lpop，RIGHT 相当于 rpop。
     * @param dest_direct 源列表弹出方向，LEFT 相当于 lpush，RIGHT 相当于 rpush。
     * @return
     */
    lmove(src: R.Key, dest: R.Key, src_direct: 'LEFT' | 'RIGHT', dest_direct: 'LEFT' | 'RIGHT'): Promise<string | null>
    /**
     * [[include:list/lmove.md]]
     *
     * @param src 源列表
     * @param dest 存储列表
     * @param src_direct 源列表弹出方向，LEFT 相当于 lpop，RIGHT 相当于 rpop。
     * @param dest_direct 源列表弹出方向，LEFT 相当于 lpush，RIGHT 相当于 rpush。
     * @param return_buffer 以 Buffer 形式返回结果。
     * @return
     */
    lmove(src: R.Key, dest: R.Key, src_direct: 'LEFT' | 'RIGHT', dest_direct: 'LEFT' | 'RIGHT', return_buffer: true): Promise<Buffer | null>
    lmove(src: R.Key, dest: R.Key, src_direct: 'LEFT' | 'RIGHT', dest_direct: 'LEFT' | 'RIGHT', return_buffer?: boolean) {
        return this.send_command(new Command<R.StringValue | null>('LMOVE', [src, dest, src_direct, dest_direct], { return_buffer }))
    }

    /**
     * [[include:list/lpop.md]]
     *
     * @category List
     * @param key
     * @return
     */
    lpop(key: R.Key): Promise<string>
    /**
     * [[include:list/lpop.md]]
     *
     * @param key
     * @param return_buffer 是否以 Buffer 形式返回。
     * @return
     */
    lpop(key: R.Key, return_buffer: true): Promise<Buffer>
    /**
     * [[include:list/lpop.md]]
     *
     * @param key
     * @param count 指定弹出元素的数量，6.2.0 及以上版本支持。
     * @return
     */
    lpop(key: R.Key, count: R.Integer): Promise<string[]>
    /**
     * [[include:list/lpop.md]]
     *
     * @param key
     * @param count 指定弹出元素的数量，6.2.0 及以上版本支持。
     * @param return_buffer 是否以 Buffer 形式返回。
     * @return
     */
    lpop(key: R.Key, count: R.Integer, return_buffer: true): Promise<Buffer[]>
    lpop(key: R.Key, count?: R.Integer | boolean, return_buffer?: boolean) {
        const args = [key]
        if (count === true) {
            return_buffer = count
            count = 0
        } else if (count !== undefined) {
            args.push(count + '')
        }
        return this.send_command(new Command<R.StringValue[] | R.StringValue | null>('LPOP', args, { return_buffer }))
    }

    /**
     * [[include:list/lpos.md]]
     *
     * @category List
     * @param key
     * @param element
     * @param options
     * @return
     */
    lpos(key: R.Key, element: string, options?: RedisClientParams.LposOptions): Promise<number | null>
    /**
     * [[include:list/lpos.md]]
     *
     * @param key
     * @param element
     * @param count 需要返回的匹配元素数量。
     * @param options
     * @return
     */
    lpos(key: R.Key, element: string, count: R.Integer, options?: RedisClientParams.LposOptions): Promise<number[]>
    lpos(key: R.Key, element: string, count?: R.Integer | RedisClientParams.LposOptions, options?: RedisClientParams.LposOptions) {
        const args = [key, element]
        if (typeof count === 'number') {
            args.push('COUNT', count + '')
        } else {
            options = count
        }
        if (options?.rank !== undefined) {
            args.push('RANK', options.rank + '')
        }
        if (options?.max_len !== undefined) {
            args.push('MAXLEN', options.max_len + '')
        }
        return this.send_command(new Command<R.Integer[] | R.Integer | null>('LPOS', args))
    }

    lpush(key: R.Key, ...values: [R.StringValue, ...R.StringValue[]]) {
        return this.send_command(new Command<R.Integer>('LPUSH', [key, ...values]))
    }

    lpushx(key: R.Key, ...values: [R.StringValue, ...R.StringValue[]]) {
        return this.send_command(new Command<R.Integer>('LPUSHX', [key, ...values]))
    }

    lrange(key: R.Key, start: R.Integer, stop: R.Integer): Promise<string[]>
    lrange(key: R.Key, start: R.Integer, stop: R.Integer, return_buffer: true): Promise<Buffer[]>
    lrange(key: R.Key, start: R.Integer, stop: R.Integer, return_buffer?: boolean) {
        return this.send_command(new Command<R.StringValue[]>('LRANGE', [key, start + '', stop + ''], { return_buffer }))
    }

    lrem(key: R.Key, count: R.Integer, element: R.StringValue) {
        return this.send_command(new Command<R.NatureNumber>('LREM', [key, count + '', element]))
    }

    lset(key: R.Key, index: R.Integer, value: R.StringValue) {
        return this.send_command(new Command<'OK'>('LSET', [key, index + '', value]))
    }

    ltrim(key: R.Key, start: R.Integer, stop: R.Integer) {
        return this.send_command(new Command<'OK'>('LTRIM', [key, start + '', stop + '']))
    }

    rpop(key: R.Key): Promise<string>
    rpop(key: R.Key, return_buffer: true): Promise<Buffer>
    rpop(key: R.Key, count: R.Integer): Promise<string[]>
    rpop(key: R.Key, count: R.Integer, return_buffer: true): Promise<Buffer[]>
    rpop(key: R.Key, count?: R.Integer | boolean, return_buffer?: boolean) {
        const args = [key]
        if (count === true) {
            return_buffer = count
            count = 0
        } else if (count !== undefined) {
            args.push(count + '')
        }
        return this.send_command(new Command<R.StringValue[] | R.StringValue | null>('RPOP', args, { return_buffer }))
    }

    rpoplpush(source: R.Key, destination: R.Key): Promise<string | null>
    rpoplpush(source: R.Key, destination: R.Key, return_buffer: true): Promise<Buffer | null>
    rpoplpush(source: R.Key, destination: R.Key, return_buffer?: boolean) {
        return this.send_command(new Command<R.StringValue | null>('RPOPLPUSH', [source, destination]))
    }

    rpush(key: R.Key, ...values: [R.StringValue, ...R.StringValue[]]) {
        return this.send_command(new Command<R.Integer>('RPUSH', [key, ...values]))
    }

    rpushx(key: R.Key, ...values: [R.StringValue, ...R.StringValue[]]) {
        return this.send_command(new Command<R.Integer>('RPUSHX', [key, ...values]))
    }
}
