import { BaseClient } from './lib/client'
import { Command } from './lib/command'
import { RedisType as R } from './lib/type'
import { RedisClientParams } from './redis-client.type'

export class RedisSetClient extends BaseClient {

    /**
     * [[include:set/sadd.md]]
     *
     * @category Set
     * @param key
     * @param members
     * @return
     */
    sadd(key: R.Key, ...members: [R.StringValue, ...R.StringValue[]]) {
        return this.send_command(new Command<R.PositiveInteger>('SADD', [key, ...members]))
    }

    /**
     * [[include:set/scard.md]]
     *
     * @category Set
     * @param key
     * @return
     */
    scard(key: R.Key) {
        return this.send_command(new Command<R.NatureNumber>('SCARD', [key]))
    }

    /**
     * [[include:set/sdiff.md]]
     *
     * @category Set
     * @param keys
     * @return
     */
    sdiff(...keys: [R.Key, ...R.Key[]]) {
        return this.send_command(new Command<R.Member[]>('SDIFF', [...keys]))
    }

    /**
     * [[include:set/sdiffstore.md]]
     *
     * @category Set
     * @param destination
     * @param keys
     * @return
     */
    sdiffstore(destination: R.Key, keys: [R.Key, ...R.Key[]]) {
        return this.send_command(new Command<R.NatureNumber>('SDIFFSTORE', [destination, ...keys]))
    }

    /**
     * [[include:set/sinter.md]]
     *
     * @category Set
     * @param keys
     * @return
     */
    sinter(...keys: [R.Key, ...R.Key[]]) {
        return this.send_command(new Command<R.Member[]>('SINTER', [...keys]))
    }

    /**
     * [[include:set/sinterstore.md]]
     *
     * @category Set
     * @param destination
     * @param keys
     * @return
     */
    sinterstore(destination: R.Key, keys: [R.Key, ...R.Key[]]) {
        return this.send_command(new Command<R.NatureNumber>('SINTERSTORE', [destination, ...keys]))
    }

    /**
     * [[include:set/sismember.md]]
     *
     * @category Set
     * @param key
     * @param member
     * @return
     */
    sismember(key: R.Key, member: R.Member) {
        return this.send_command(new Command<0 | 1>('SISMEMBER', [key, member]))
    }

    /**
     * [[include:set/smembers.md]]
     *
     * @category Set
     * @param key
     * @return
     */
    smembers(key: R.Key): Promise<string[]>
    /**
     * [[include:set/smembers.md]]
     *
     * @param key
     * @param return_buffer
     * @return
     */
    smembers(key: R.Key, return_buffer: true): Promise<Buffer[]>
    smembers(key: R.Key, return_buffer?: boolean) {
        return this.send_command(new Command<R.StringValue[]>('SMEMBERS', [key], { return_buffer }))
    }

    /**
     * [[include:set/smismember.md]]
     *
     * @category Set
     * @param key
     * @param members
     * @return
     */
    smismember(key: R.Key, ...members: [R.StringValue, ...R.StringValue[]]) {
        return this.send_command(new Command<R.Integer[]>('SMISMEMBER', [key, ...members]))
    }

    /**
     * [[include:set/smove.md]]
     *
     * @category Set
     * @param source
     * @param destination
     * @param member
     * @return
     */
    smove(source: R.Key, destination: R.Key, member: R.Member) {
        return this.send_command(new Command<R.Bit>('SMOVE', [source, destination, member]))
    }

    /**
     * [[include:set/spop.md]]
     *
     * @category Set
     * @param key
     * @return
     */
    spop(key: R.Key): Promise<string | null>
    /**
     * [[include:set/spop.md]]
     *
     * @param key
     * @param return_buffer 以 Buffer 形式返回结果。
     * @return
     */
    spop(key: R.Key, return_buffer: true): Promise<Buffer | null>
    /**
     * [[include:set/spop.md]]
     *
     * @param key
     * @param count 指定需要 pop 的元素个数。
     * @return
     */
    spop(key: R.Key, count: R.NatureNumber): Promise<string[]>
    /**
     * [[include:set/spop.md]]
     *
     * @param key
     * @param count 指定需要 pop 的元素个数。
     * @param return_buffer 以 Buffer 形式返回结果。
     * @return
     */
    spop(key: R.Key, count: R.NatureNumber, return_buffer: true): Promise<Buffer[]>
    spop(key: R.Key, count?: R.NatureNumber | true, return_buffer?: boolean) {
        const args = [key]
        if (count === true) {
            return_buffer = true
            count = undefined
        }
        if (count !== undefined) {
            args.push(count + '')
        }
        return this.send_command(new Command<R.StringValue[] | R.StringValue | null>('SPOP', args, { return_buffer }))
    }

    /**
     * [[include:set/srandmember.md]]
     *
     * @category Set
     * @param key
     * @return
     */
    srandmember(key: R.Key): Promise<string | null>
    /**
     * [[include:set/srandmember.md]]
     *
     * @param key
     * @param return_buffer
     * @return
     */
    srandmember(key: R.Key, return_buffer: true): Promise<Buffer | null>
    /**
     * [[include:set/srandmember.md]]
     *
     * @param key
     * @param count
     * @return
     */
    srandmember(key: R.Key, count: R.Integer): Promise<string[]>
    /**
     * [[include:set/srandmember.md]]
     *
     * @param key
     * @param count
     * @param return_buffer
     * @return
     */
    srandmember(key: R.Key, count: R.Integer, return_buffer: true): Promise<Buffer[]>
    srandmember(key: R.Key, count?: R.Integer | true, return_buffer?: boolean) {
        const args = [key]
        if (count === true) {
            return_buffer = true
            count = undefined
        }
        if (count !== undefined) {
            args.push(count + '')
        }
        return this.send_command(new Command<R.StringValue[] | R.StringValue | null>('SRANDMEMBER', args, { return_buffer }))
    }

    /**
     * [[include:set/srem.md]]
     *
     * @category Set
     * @param key
     * @param members
     * @return
     */
    srem(key: R.Key, ...members: [R.Member, ...R.Member[]]) {
        return this.send_command(new Command<R.NatureNumber>('SREM', [key, ...members]))
    }

    /**
     * [[include:set/sscan.md]]
     *
     * @category Set
     * @param key
     * @param cursor
     * @param options
     * @return
     */
    sscan(key: R.Key, cursor: number, options?: RedisClientParams.SScanOptions) {
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
     * [[include:set/sunion.md]]
     *
     * @category Set
     * @param keys
     * @return
     */
    sunion(...keys: [R.Key, ...R.Key[]]) {
        return this.send_command(new Command<R.Member[]>('SUNION', [...keys]))
    }

    /**
     * [[include:set/sunionstore.md]]
     *
     * @category Set
     * @param destination
     * @param keys
     * @return
     */
    sunionstore(destination: R.Key, keys: [R.Key, ...R.Key[]]) {
        return this.send_command(new Command<R.NatureNumber>('SUNIONSTORE', [destination, ...keys]))
    }
}
