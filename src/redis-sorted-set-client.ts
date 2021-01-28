import { BaseClient } from './lib/client'
import { Command } from './lib/command'
import { RedisType as R, RedisUtilType as Util } from './lib/type'
import { RedisClientParams as P } from './redis-client.type'

export class RedisSortedSetClient extends BaseClient {

    /**
     * [[include:zset/bzpopmax.md]]
     *
     * @category Sorted Set
     * @param keys
     * @param timeout 超时时间，单位秒。6.0 版本开始支持双精度浮点数表示，更早的版本只支持整数。
     * @return
     */
    bzpopmax(keys: [R.Key, ...R.Key[]], timeout: R.NatureNumber) {
        const args = [...keys, timeout + '']
        return this.send_command(new Command<R.KeyMemberScore>('BZPOPMAX', args))
    }

    /**
     * [[include:zset/bzpopmin.md]]
     *
     * @category Sorted Set
     * @param keys
     * @param timeout 超时时间，单位秒。6.0 版本开始支持双精度浮点数表示，更早的版本只支持整数。
     * @return
     */
    bzpopmin(keys: [R.Key, ...R.Key[]], timeout: R.NatureNumber) {
        const args = [...keys, timeout + '']
        return this.send_command(new Command<R.KeyMemberScore>('BZPOPMIN', args))
    }

    /**
     * [[include:zset/zadd.md]]
     *
     * @category Sorted Set
     * @typeParam T
     * @param key
     * @param member_score_pair 2.4 版本开始支持多组 member/score，更早的版本只能传递一组 member/score。
     * @param options
     * @return
     */
    zadd<T extends { [key: string]: R.StringDoubleValue | number }>(key: R.Key, member_score_pair: Util.NonEmptyObject<T>, options?: P.ZaddOptions): Promise<R.NatureNumber>
    /**
     * [[include:zset/zadd.md]]
     *
     * @typeParam T
     * @param key
     * @param member_score_pair 2.4 版本开始支持多组 member/score，更早的版本只能传递一组 member/score。
     * @param incr_mode 自增模式，3.0.2 版本开始可用。
     * @param options
     * @return
     */
    zadd<T extends { [key: string]: R.StringDoubleValue | number }>(key: R.Key, member_score_pair: Util.NonEmptyObject<T>, incr_mode: true, options?: P.ZaddOptions): Promise<R.StringDoubleValue | null>
    zadd<T extends { [key: string]: R.StringDoubleValue | number }>(key: R.Key, member_score_pair: Util.NonEmptyObject<T>, incr_mode?: true | P.ZaddOptions, options?: P.ZaddOptions) {
        if (typeof incr_mode !== 'boolean') {
            options = incr_mode
            incr_mode = undefined
        }
        const args = [key]
        if (options?.update_if_member) {
            args.push(options.update_if_member)
        }
        if (options?.update_if_score) {
            args.push(options.update_if_score)
        }
        if (options?.return_change_count) {
            args.push('CH')
        }
        if (incr_mode) {
            args.push('INCR')
        }
        const score_member_arr = Object.entries(member_score_pair as T).map(arr => arr.reverse()).flat()
        return this.send_command(new Command<string | number | null>('ZADD', [...args, ...score_member_arr.map(i => i + '')]))
    }

    zcard(key: R.Key) {
        return this.send_command(new Command<R.NatureNumber>('ZCARD', [key]))
    }

    zcount(key: R.Key, min: R.ZsetRangeScoreMin, max: R.ZsetRangeScoreMax) {
        return this.send_command(new Command<R.NatureNumber>('ZCOUNT', [key, min, max]))
    }

    zdiff(keys: [R.Key, ...R.Key[]]): Promise<R.Key[]>
    zdiff(keys: [R.Key, ...R.Key[]], withscores: true): Promise<R.MemberScoreArray>
    zdiff(keys: [R.Key, ...R.Key[]], withscores?: boolean) {
        const args = [keys.length + '', ...keys]
        if (withscores) {
            args.push('WITHSCORES')
        }
        return this.send_command(new Command<R.Key[] | R.MemberScoreArray>('ZDIFF', args))
    }

    zdiffstore(destination: R.Key, keys: [R.Key, ...R.Key[]]) {
        return this.send_command(new Command<R.NatureNumber>('ZDIFFSTORE', [destination, keys.length + '', ...keys]))
    }

    zincrby(key: R.Key, increment: R.StringDoubleValue, member: R.Member) {
        return this.send_command(new Command<R.StringDoubleValue>('ZINCRBY', [key, increment + '', member]))
    }

    zinter<T extends [R.Key, ...R.Key[]]>(keys: T, options?: P.ZinterOptions<T>): Promise<R.Member[]>
    zinter<T extends [R.Key, ...R.Key[]]>(keys: T, withscores: true, options?: P.ZinterOptions<T>): Promise<R.MemberScoreArray>
    zinter<T extends [R.Key, ...R.Key[]]>(keys: T, withscores?: true | P.ZinterOptions<T>, options?: P.ZinterOptions<T>) {
        const args = [keys.length + '', ...keys]
        if (withscores !== true) {
            options = withscores
            withscores = undefined
        }
        options?.weights && args.push('WEIGHTS', ...options?.weights.map(w => w + ''))
        options?.aggregate && args.push('AGGREGATE', options.aggregate)
        withscores && args.push('WITHSCORES')
        return this.send_command(new Command<R.Key[] | R.MemberScoreArray>('ZINTER', args))
    }

    zinterstore<T extends [R.Key, ...R.Key[]]>(destination: R.Key, keys: [R.Key, ...R.Key[]], options?: P.ZinterOptions<T>) {
        const args = [destination, keys.length + '', ...keys]
        options?.weights && args.push('WEIGHTS', ...options?.weights.map(w => w + ''))
        options?.aggregate && args.push('AGGREGATE', options?.aggregate)
        return this.send_command(new Command<R.NatureNumber>('ZINTERSTORE', args))
    }

    zlexcount(key: R.Key, min: R.ZsetRangeMemberMin, max: R.ZsetRangeMemberMax) {
        return this.send_command(new Command<R.NatureNumber>('ZLEXCOUNT', [key, min, max]))
    }

    zmscore(key: R.Key, ...members: [R.Member, ...R.Member[]]) {
        return this.send_command(new Command<Array<R.StringDoubleValue | null>>('ZMSCORE', [key, ...members]))
    }

    /**
     * [[include:zset/zpopmax.md]]
     *
     * @category Sorted Set
     * @param key
     * @param count
     * @return
     */
    zpopmax(key: R.Key, count?: R.NatureNumber) {
        const args = [key]
        if (count !== undefined) {
            args.push(count + '')
        }
        return this.send_command(new Command<R.MemberScoreArray>('ZPOPMAX', args))
    }

    /**
     * [[include:zset/zpopmin.md]]
     *
     * @category Sorted Set
     * @param key
     * @param count
     * @return
     */
    zpopmin(key: R.Key, count?: R.NatureNumber) {
        const args = [key]
        if (count !== undefined) {
            args.push(count + '')
        }
        return this.send_command(new Command<R.MemberScoreArray>('ZPOPMIN', args))
    }

    zrange(key: R.Key, min: R.Integer, max: R.Integer, by: 'BYRANK', options?: Pick<P.ZrangeOptions, 'reverse'>): Promise<R.Member[]>
    zrange(key: R.Key, min: R.Integer, max: R.Integer, by: 'BYRANK', withscores: true, options?: Pick<P.ZrangeOptions, 'reverse'>): Promise<R.MemberScoreArray>
    zrange(key: R.Key, min: R.ZsetRangeMemberOpenMin, max: R.ZsetRangeMemberOpenMax, by: 'BYLEX', options?: Pick<P.ZrangeOptions, 'limit'>): Promise<R.Member[]>
    zrange(key: R.Key, min: R.ZsetRangeScoreMin, max: R.ZsetRangeScoreMax, by: 'BYSCORE', options?: Pick<P.ZrangeOptions, 'limit'>): Promise<R.Member[]>
    zrange(key: R.Key, min: R.ZsetRangeScoreMin, max: R.ZsetRangeScoreMax, by: 'BYSCORE', withscores: true, options?: Pick<P.ZrangeOptions, 'limit'>): Promise<R.MemberScoreArray>
    zrange(key: R.Key, min: string | number, max: string | number, by: P.ZrangeBy, withscores?: true | P.ZrangeOptions, options?: P.ZrangeOptions) {
        const args = [key, min + '', max + '']
        if (withscores !== true) {
            options = withscores
            withscores = undefined
        }
        by !== 'BYRANK' && args.push(by)
        options?.reverse && args.push('REV')
        options?.limit && args.push('LIMIT', options.limit[0] + '', options.limit[1] + '')
        withscores && args.push('WITHSCORES')
        return this.send_command(new Command<R.Member[] | R.MemberScoreArray>('ZRANGE', args))
    }

    zrangebylex(key: R.Key, min: R.ZsetRangeMemberOpenMin, max: R.ZsetRangeMemberOpenMax, limit?: [R.Integer, R.Integer]) {
        const args = [key, min, max, ...(limit ? ['LIMIT', ...limit.map(a => a + '')] : [])]
        return this.send_command(new Command<R.MemberArray>('ZRANGEBYLEX', args))
    }

    zrangebyscore(key: R.Key, min: R.ZsetRangeScoreMin, max: R.ZsetRangeScoreMax, limit: [R.Integer, R.Integer]): Promise<R.Member[]>
    zrangebyscore(key: R.Key, min: R.ZsetRangeScoreMin, max: R.ZsetRangeScoreMax, withscores: true): Promise<R.MemberScoreArray>
    zrangebyscore(key: R.Key, min: R.ZsetRangeScoreMin, max: R.ZsetRangeScoreMax, limit: [R.Integer, R.Integer], withscores: true): Promise<R.MemberScoreArray>
    zrangebyscore(key: R.Key, min: R.ZsetRangeScoreMin, max: R.ZsetRangeScoreMax, limit?: [R.Integer, R.Integer] | true, withscores?: true) {
        const args = [key, min, max]
        if (limit === true) {
            withscores = limit
            limit = undefined
        }
        limit && args.push('LIMIT', limit[0] + '', limit[1] + '')
        withscores && args.push('WITHSCORES')
        return this.send_command(new Command<R.MemberScoreArray | R.Member[]>('ZRANGEBYSCORE', args))
    }

    zrangestore(dst: R.Key, src: R.Key, min: R.Integer, max: R.Integer, by: 'BYRANK', options?: Pick<P.ZrangeOptions, 'reverse'>): Promise<R.NatureNumber>
    zrangestore(dst: R.Key, src: R.Key, min: R.ZsetRangeMemberOpenMin, max: R.ZsetRangeMemberOpenMax, by: 'BYLEX', options?: Pick<P.ZrangeOptions, 'limit'>): Promise<R.NatureNumber>
    zrangestore(dst: R.Key, src: R.Key, min: R.ZsetRangeScoreMin, max: R.ZsetRangeScoreMax, by: 'BYSCORE', options?: Pick<P.ZrangeOptions, 'limit'>): Promise<R.NatureNumber>
    zrangestore(dst: R.Key, src: R.Key, min: string | number, max: string | number, by: P.ZrangeBy, options?: P.ZrangeOptions) {
        const args = [dst, src, min + '', max + '']
        by !== 'BYRANK' && args.push(by)
        options?.reverse && args.push('REV')
        options?.limit && args.push('LIMIT', options.limit[0] + '', options.limit[1] + '')
        return this.send_command(new Command<R.NatureNumber>('ZRANGESTORE', args))
    }

    zrank(key: R.Key, member: R.Member) {
        return this.send_command(new Command<R.NatureNumber | null>('ZRANK', [key, member]))
    }

    zrem(key: R.Key, members: [R.Member, ...R.Member[]]) {
        return this.send_command(new Command<R.NatureNumber>('ZREM', [key, ...members]))
    }

    zremrangebylex(key: R.Key, min: R.ZsetRangeMemberOpenMin, max: R.ZsetRangeMemberOpenMax) {
        return this.send_command(new Command<R.NatureNumber>('ZREMRANGEBYLEX', [key, min, max]))
    }

    zremrangebyrank(key: R.Key, start: R.Integer, stop: R.Integer) {
        return this.send_command(new Command<R.NatureNumber>('ZREMRANGEBYRANK', [key, start + '', stop + '']))
    }

    zremrangebyscore(key: R.Key, min: R.ZsetRangeScoreMin, max: R.ZsetRangeScoreMax) {
        return this.send_command(new Command<R.NatureNumber>('ZREMRANGEBYSCORE', [key, min, max]))
    }

    zrevrange(key: R.Key, start: R.Integer, stop: R.Integer): Promise<R.Member[]>
    zrevrange(key: R.Key, start: R.Integer, stop: R.Integer, withscores: true): Promise<R.MemberScoreArray>
    zrevrange(key: R.Key, start: R.Integer, stop: R.Integer, withscores?: true) {
        const args = [key, start + '', stop + '']
        if (withscores) {
            args.push('WITHSCORES')
        }
        return this.send_command(new Command<R.MemberArray>('ZREVRANGE', args))
    }

    zrevrangebylex(key: R.Key, min: R.ZsetRangeMemberOpenMin, max: R.ZsetRangeMemberOpenMax, limit?: [R.Integer, R.Integer]) {
        const args = [key, min, max, ...(limit ? ['LIMIT', ...limit.map(a => a + '')] : [])]
        return this.send_command(new Command<R.MemberArray>('ZREVRANGEBYLEX', args))
    }

    zrevrangebyscore(key: R.Key, min: R.ZsetRangeScoreMin, max: R.ZsetRangeScoreMax, withscores: true): Promise<R.MemberScoreArray>
    zrevrangebyscore(key: R.Key, min: R.ZsetRangeScoreMin, max: R.ZsetRangeScoreMax, limit: [R.Integer, R.Integer]): Promise<R.Member[]>
    zrevrangebyscore(key: R.Key, min: R.ZsetRangeScoreMin, max: R.ZsetRangeScoreMax, limit: [R.Integer, R.Integer], withscores: true): Promise<R.MemberScoreArray>
    zrevrangebyscore(key: R.Key, min: R.ZsetRangeScoreMin, max: R.ZsetRangeScoreMax, limit?: [R.Integer, R.Integer] | true, withscores?: boolean) {
        const args = [key, min, max]
        if (limit === true) {
            withscores = limit
            limit = undefined
        }
        limit && args.push('LIMIT', limit[0] + '', limit[1] + '')
        withscores && args.push('WITHSCORES')
        return this.send_command(new Command<R.MemberArray>('ZREVRANGEBYSCORE', args))
    }

    zrevrank(key: R.Key, member: R.Member) {
        return this.send_command(new Command<R.NatureNumber | null>('ZREVRANK', [key, member]))
    }

    zscore(key: R.Key, member: R.Member) {
        return this.send_command(new Command<R.StringDoubleValue, R.StringDoubleValue>('ZSCORE', [key, member]))
    }

    zunion<T extends [R.Key, ...R.Key[]]>(keys: T, options?: P.ZunionOptions<T>): Promise<R.Member[]>
    zunion<T extends [R.Key, ...R.Key[]]>(keys: T, withscores: true, options?: P.ZunionOptions<T>): Promise<R.MemberScoreArray>
    zunion<T extends [R.Key, ...R.Key[]]>(keys: T, withscores?: true | P.ZunionOptions<T>, options?: P.ZunionOptions<T>) {
        const args = [keys.length + '', ...keys]
        if (withscores !== true) {
            options = withscores
            withscores = undefined
        }
        options?.weights && args.push('WEIGHTS', ...options?.weights.map(w => w + ''))
        options?.aggregate && args.push('AGGREGATE', options.aggregate)
        withscores && args.push('WITHSCORES')
        return this.send_command(new Command<R.Member[] | R.MemberScoreArray>('ZUNION', args))
    }

    zunionstore<T extends [R.Key, ...R.Key[]]>(destination: R.Key, keys: [R.Key, ...R.Key[]], options?: P.ZinterOptions<T>) {
        const args = [destination, keys.length + '', ...keys]
        options?.weights && args.push('WEIGHTS', ...options?.weights.map(w => w + ''))
        options?.aggregate && args.push('AGGREGATE', options?.aggregate)
        return this.send_command(new Command<R.NatureNumber>('ZUNIONSTORE', args))
    }
}
