import { BaseClient } from './lib/client'
import { Command } from './lib/command'
import { AlgorithmLCSResult, RedisType as R } from './lib/type'
import { RedisUtils } from './lib/utils'
import { RedisClientParams } from './redis-client.type'
import parse_stralgo_lcs_result = RedisUtils.parse_stralgo_lcs_result

export class RedisStringClient extends BaseClient {

    /**
     * [[include:string/append.md]]
     *
     * @category String
     * @param key
     * @param value 需要追加的内容。
     * @return
     */
    append(key: R.Key, value: R.StringValue) {
        return this.send_command(new Command<R.KeyCount>('APPEND', [key, value]))
    }

    /**
     * [[include:string/bitcount.md]]
     *
     * @category String
     * @param key
     * @return
     */
    bitcount(key: R.Key): Promise<R.Integer>
    /**
     * [[include:string/bitcount.md]]
     *
     * @param key
     * @param start
     * @return
     */
    bitcount(key: R.Key, start: R.Integer): Promise<R.Integer>
    /**
     * [[include:string/bitcount.md]]
     *
     * @param key
     * @param start
     * @param end
     * @return
     */
    bitcount(key: R.Key, start: R.Integer, end: R.Integer): Promise<R.Integer>
    bitcount(key: R.Key, start?: R.Integer, end?: R.Integer) {
        const args = [key]
        if (start !== undefined) {
            args.push(start + '', (end ?? -1) + '')
        }
        return this.send_command(new Command<R.Integer>('BITCOUNT', args))
    }

    /**
     * [[include:string/bitfield.md]]
     *
     * @category String
     * @param key
     * @param pipeline
     * @return
     */
    bitfield(key: R.Key, pipeline: RedisClientParams.BitField.BitFieldPipeline) {
        const args = [key]
        pipeline.forEach((cmd: any[]) => args.push(...cmd.map(c => c + '')))
        return this.send_command(new Command<R.Integer[]>('BITFIELD', args))
    }

    /**
     * [[include:string/bitop.md]]
     *
     * **按位与**，接受多个 key。
     *
     * @category String
     * @param operation
     * @param dest
     * @param keys
     * @return
     */
    bitop(operation: 'AND', dest: R.Key, keys: [R.Key, ...R.Key[]]): Promise<R.NatureNumber>
    /**
     * [[include:string/bitop.md]]
     *
     * **按位或**，接受多个 key。
     *
     * @param operation
     * @param dest
     * @param keys
     * @return
     */
    bitop(operation: 'OR', dest: R.Key, keys: [R.Key, ...R.Key[]]): Promise<R.NatureNumber>
    /**
     * [[include:string/bitop.md]]
     *
     * **按位异或**，接受多个 key。
     *
     * @param operation
     * @param dest
     * @param keys
     * @return
     */
    bitop(operation: 'XOR', dest: R.Key, keys: [R.Key, ...R.Key[]]): Promise<R.NatureNumber>
    /**
     * [[include:string/bitop.md]]
     *
     * **按位取反**，接受单个 key。
     *
     * @param operation
     * @param dest
     * @param keys
     * @return
     */
    bitop(operation: 'NOT', dest: R.Key, keys: [R.Key]): Promise<R.NatureNumber>
    bitop(operation: 'AND' | 'OR' | 'XOR' | 'NOT', dest: R.Key, keys: [R.Key, ...R.Key[]]) {
        return this.send_command(new Command<R.NatureNumber>('BITOP', [operation, dest, ...keys]))
    }

    /**
     * [[include:string/bitpos.md]]
     *
     * @category String
     * @param key
     * @param bit 目标 bit，1 或 0。
     * @return
     */
    bitpos(key: R.Key, bit: R.Bit): Promise<R.NatureNumber | -1>
    /**
     * [[include:string/bitpos.md]]
     *
     * @param key
     * @param bit 目标 bit，1 或 0。
     * @param start 开始的字节位置。
     * @return
     */
    bitpos(key: R.Key, bit: R.Bit, start: R.Integer): Promise<R.NatureNumber | -1>
    /**
     * [[include:string/bitpos.md]]
     *
     * @param key
     * @param bit 目标 bit，1 或 0。
     * @param start 开始的字节位置。
     * @param end 结束的字节位置。
     * @return
     */
    bitpos(key: R.Key, bit: R.Bit, start: R.Integer, end: R.Integer): Promise<R.NatureNumber | -1>
    bitpos(key: R.Key, bit: R.Bit, start?: R.Integer, end?: R.Integer) {
        const args = [key, bit + '']
        start && args.push(start.toString())
        end && args.push(end.toString())
        return this.send_command(new Command<R.NatureNumber | -1>('BITPOS', args))
    }

    /**
     * [[include:string/decr.md]]
     *
     * @category String
     * @param key
     * @return
     */
    decr(key: R.Key): Promise<number>
    /**
     * [[include:string/decr.md]]
     *
     * @param key
     * @param string_number 是否以字符串形式返回结果。
     * @return
     */
    decr(key: R.Key, string_number: true): Promise<string>
    decr(key: R.Key, string_number?: boolean) {
        return this.send_command(new Command<R.Integer | string>('DECR', [key], { string_number }))
    }

    /**
     * [[include:string/decrby.md]]
     *
     * @category String
     * @param key
     * @param delta 偏移量
     * @return
     */
    decrby(key: R.Key, delta: R.Integer | string): Promise<number>
    /**
     * [[include:string/decrby.md]]
     *
     * @param key
     * @param delta
     * @param string_number 是否以字符串形式返回结果。
     * @return
     */
    decrby(key: R.Key, delta: R.Integer | string, string_number: true): Promise<string>
    decrby(key: R.Key, delta: R.Integer | string, string_number?: boolean) {
        return this.send_command(new Command<R.Integer | string>('DECRBY', [key, delta + ''], { string_number }))
    }

    /**
     * [[include:string/get.md]]
     *
     * @category String
     * @param key
     * @return
     */
    get(key: R.Key): Promise<string | null>
    /**
     * [[include:string/get.md]]
     *
     * @param key
     * @param return_buffer 是否以 Buffer 形式返回结果。
     * @return
     */
    get(key: R.Key, return_buffer: true): Promise<Buffer | null>
    get(key: R.Key, return_buffer?: boolean) {
        return this.send_command(new Command<R.StringValue | null>('GET', [key], { return_buffer }))
    }

    /**
     * [[include:string/getbit.md]]
     *
     * @category String
     * @param key
     * @param offset
     * @return
     */
    getbit(key: R.Key, offset: R.NatureNumber) {
        return this.send_command(new Command<R.Bit>('GETBIT', [key, offset + '']))
    }

    /**
     * [[include:string/getrange.md]]
     *
     * @category String
     * @param key
     * @param start 开始的字节数。
     * @param end 结束的字节数。
     * @return
     */
    getrange(key: R.Key, start: R.Integer, end: R.Integer): Promise<string>
    /**
     * [[include:string/getrange.md]]
     *
     * @param key
     * @param start 开始的字节数。
     * @param end 结束的字节数。
     * @param return_buffer 是否以 Buffer 形式返回。
     * @return
     */
    getrange(key: R.Key, start: R.Integer, end: R.Integer, return_buffer: true): Promise<Buffer>
    getrange(key: R.Key, start: R.Integer, end: R.Integer, return_buffer?: boolean) {
        return this.send_command(new Command<R.StringValue>('GETRANGE', [key, start + '', end + ''], { return_buffer }))
    }

    /**
     * [[include:string/getset.md]]
     *
     * @category String
     * @param key
     * @param value
     * @return
     */
    getset(key: R.Key, value: R.StringValue): Promise<string | null>
    /**
     * [[include:string/getset.md]]
     *
     * @param key
     * @param value
     * @param return_buffer
     * @return
     */
    getset(key: R.Key, value: R.StringValue, return_buffer: true): Promise<Buffer | null>
    getset(key: R.Key, value: R.StringValue, return_buffer?: boolean) {
        return this.send_command(new Command<R.StringValue | null>('GETSET', [key, value], { return_buffer }))
    }

    /**
     * [[include:string/incr.md]]
     *
     * @category String
     * @param key
     * @return
     */
    incr(key: R.Key): Promise<number>
    /**
     * [[include:string/incr.md]]
     *
     * @param key
     * @param string_number 是否以字符串形式返回结果。
     * @return
     */
    incr(key: R.Key, string_number: true): Promise<string>
    incr(key: R.Key, string_number?: boolean) {
        return this.send_command(new Command<R.Integer | string>('INCR', [key], { string_number }))
    }

    /**
     * [[include:string/incrby.md]]
     *
     * @category String
     * @param key
     * @param delta
     * @return
     */
    incrby(key: R.Key, delta: R.Integer | string): Promise<number>
    /**
     * [[include:string/incrby.md]]
     *
     * @param key
     * @param delta
     * @param string_number 是否以字符串形式返回结果。
     * @return
     */
    incrby(key: R.Key, delta: R.Integer | string, string_number: true): Promise<string>
    incrby(key: R.Key, delta: R.Integer | string, string_number?: boolean) {
        return this.send_command(new Command<R.Integer | string>('INCRBY', [key, delta + ''], { string_number }))
    }

    /**
     * [[include:string/incrbyfloat.md]]
     *
     * @category String
     * @param key
     * @param increment
     * @return
     */
    incrbyfloat(key: R.Key, increment: R.StringDoubleValue) {
        return this.send_command(new Command<R.StringDoubleValue>('INCRBYFLOAT', [key, increment + '']))
    }

    /**
     * [[include:string/mget.md]]
     *
     * @category String
     * @param keys
     * @return
     */
    mget(keys: [R.Key, ...R.Key[]]): Promise<(string | null)[]>
    /**
     * [[include:string/mget.md]]
     *
     * @param keys
     * @param return_buffer 是否按 Buffer 形式返回结果。
     * @return
     */
    mget(keys: [R.Key, ...R.Key[]], return_buffer: true): Promise<(Buffer | null)[]>
    mget(keys: [R.Key, ...R.Key[]], return_buffer?: boolean) {
        return this.send_command(new Command<(R.StringValue | null)[]>('MGET', keys, { return_buffer }))
    }

    /**
     * [[include:string/mset.md]]
     *
     * @category String
     * @param kvs
     * @return
     */
    mset(kvs: {
        /**
         * 键值对，值可以是 Buffer 或 string
         */
        [key: string]: R.StringValue
    }) {
        return this.send_command(new Command<'OK'>('MSET', Object.entries(kvs).flat()))
    }

    /**
     * [[include:string/msetnx.md]]
     *
     * @category String
     * @param kvs
     * @return
     */
    msetnx(kvs: {
        /**
         * 键值对，值可以是 Buffer 或 string
         */
        [key: string]: R.StringValue
    }) {
        return this.send_command(new Command<R.Bit>('MSETNX', Object.entries(kvs).flat()))
    }

    /**
     * [[include:string/psetex.md]]
     *
     * @category String
     * @param key
     * @param value
     * @param milli_ex
     * @return
     */
    psetex(key: R.Key, value: R.StringValue, milli_ex: R.Integer) {
        return this.send_command(new Command<'OK'>('PSETEX', [key, milli_ex + '', value]))
    }

    /**
     * [[include:string/set.md]]
     *
     * @category String
     * @param key
     * @param value
     * @return
     */
    set(key: R.Key, value: R.StringValue): Promise<'OK'>
    /**
     * [[include:string/set.md]]
     *
     * @param key
     * @param value
     * @param get 是否需要返回原值。6.2.0 及以上版本可用。
     * @return
     */
    set(key: R.Key, value: R.StringValue, get: true): Promise<string | null>
    /**
     * [[include:string/set.md]]
     *
     * @param key
     * @param value
     * @param get 是否需要返回原值。6.2.0 及以上版本可用。
     * @param return_buffer 是否以 Buffer 形式返回结果。
     * @return
     */
    set(key: R.Key, value: R.StringValue, get: true, return_buffer: true): Promise<Buffer | null>
    /**
     * [[include:string/set.md]]
     *
     * @param key
     * @param value
     * @param options
     * @return
     */
    set(key: R.Key, value: R.StringValue, options: RedisClientParams.SetOptions): Promise<'OK' | null>
    /**
     * [[include:string/set.md]]
     *
     * @param key
     * @param value
     * @param get 是否需要返回原值。6.2.0 及以上版本可用。
     * @param options
     * @return
     */
    set(key: R.Key, value: R.StringValue, get: true, options: RedisClientParams.SetOptions): Promise<string | null>
    /**
     * [[include:string/set.md]]
     *
     * @param key
     * @param value
     * @param get 是否需要返回原值。6.2.0 及以上版本可用。
     * @param return_buffer 是否以 Buffer 形式返回结果。
     * @param options
     * @return
     */
    set(key: R.Key, value: R.StringValue, get: true, return_buffer: true, options: RedisClientParams.SetOptions): Promise<Buffer | null>
    set(key: R.Key, value: R.StringValue, get?: boolean | RedisClientParams.SetOptions, return_buffer?: boolean | RedisClientParams.SetOptions, options?: RedisClientParams.SetOptions) {
        const args = [key, value]
        if (typeof get === 'object') {
            options = get
            get = false
            return_buffer = false
        } else if (typeof return_buffer === 'object') {
            options = return_buffer
            return_buffer = false
        }
        if (options?.keepttl) {
            args.push('KEEPTTL')
        } else if (options?.expire) {
            args.push('EX', options.expire + '')
        } else if (options?.pexpire) {
            args.push('PX', options.pexpire + '')
        }
        if (options?.exist !== undefined) {
            args.push(options.exist ? 'XX' : 'NX')
        }
        if (get) {
            args.push('GET')
        }
        return this.send_command(new Command<string | Buffer | null>('SET', args, { return_buffer }))
    }

    /**
     * [[include:string/setbit.md]]
     *
     * @category String
     * @param key
     * @param offset
     * @param value
     * @return
     */
    setbit(key: R.Key, offset: R.NatureNumber, value: R.Bit) {
        return this.send_command(new Command<R.Bit>('SETBIT', [key, offset + '', value + '']))
    }

    /**
     * [[include:string/setex.md]]
     *
     * @category String
     * @param key
     * @param value
     * @param ttl
     * @return
     */
    setex(key: R.Key, value: R.StringValue, ttl: R.Integer) {
        return this.send_command(new Command<'OK'>('SETEX', [key, ttl + '', value]))
    }

    /**
     * [[include:string/setnx.md]]
     *
     * @category String
     * @param key
     * @param value
     * @return
     */
    setnx(key: R.Key, value: R.StringValue) {
        return this.send_command(new Command<R.Bit>('SETNX', [key, value]))
    }

    /**
     * [[include:string/setrange.md]]
     *
     * @category String
     * @param key
     * @param offset 偏移量，字节为单位。
     * @param value 需要写入的值。
     * @return
     */
    setrange(key: R.Key, offset: R.NatureNumber, value: R.StringValue) {
        return this.send_command(new Command<R.NatureNumber>('SETRANGE', [key, offset + '', value]))
    }

    /**
     * [[include:string/stralgo_lcs.md]]
     *
     * 默认的返回模式为返回匹配到的子序列。
     *
     * @category String
     * @param input_mode 输入模式 keys 表示按照给定的 key 寻找值进行运算，strings 表示 直接给出进行运算的值。
     * @param k1 第一个输入值。
     * @param k2 第二个输入值。
     * @return
     */
    stralgo_lcs(input_mode: 'keys' | 'strings', k1: string, k2: string): Promise<string>
    /**
     * [[include:string/stralgo_lcs.md]]
     *
     * @param input_mode 输入模式 keys 表示按照给定的 key 寻找值进行运算，strings 表示 直接给出进行运算的值。
     * @param k1 第一个输入值。
     * @param k2 第二个输入值。
     * @param return_mode 返回结果模式 LEN 表示值返回匹配结果长度。
     * @return
     */
    stralgo_lcs(input_mode: 'keys' | 'strings', k1: string, k2: string, return_mode: 'LEN'): Promise<number>
    /**
     * [[include:string/stralgo_lcs.md]]
     *
     * @param input_mode 输入模式 keys 表示按照给定的 key 寻找值进行运算，strings 表示 直接给出进行运算的值。
     * @param k1 第一个输入值。
     * @param k2 第二个输入值。
     * @param return_mode 返回结果模式 IDX 表示值返回匹配结果的详细信息。
     * @param min_match_len 最小匹配长度，这个参数只是在返回时用来过滤结果中 results 的内容，不会影响整个算法的匹配过程。
     * @return
     */
    stralgo_lcs(input_mode: 'keys' | 'strings', k1: string, k2: string, return_mode: 'IDX', min_match_len?: number): Promise<AlgorithmLCSResult>
    stralgo_lcs(input_mode: 'keys' | 'strings', k1: string, k2: string, return_mode?: 'LEN' | 'IDX', min_match_len?: number) {
        const args = ['LCS']
        if (input_mode === 'keys') {
            args.push('KEYS', k1, k2)
        } else {
            args.push('STRINGS', k1, k2)
        }
        if (return_mode === 'LEN') {
            args.push('LEN')
        } else if (return_mode === 'IDX') {
            args.push('IDX', 'WITHMATCHLEN')
        }
        if (min_match_len !== undefined) {
            args.push('MINMATCHLEN', min_match_len + '')
        }
        return this.send_command(new Command<string | number | AlgorithmLCSResult>('STRALGO', args, undefined, res => return_mode === 'IDX' ? parse_stralgo_lcs_result(res) : res))
    }

    /**
     * [[include:string/strlen.md]]
     *
     * @category String
     * @param key
     * @return
     */
    strlen(key: R.Key) {
        return this.send_command(new Command<R.NatureNumber>('STRLEN', [key]))
    }
}
