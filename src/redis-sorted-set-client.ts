import { BaseClient } from './lib/client'
import { Command } from './lib/command'
import { RedisType as R, RedisUtilType as Util } from './lib/type'
import { RedisClientParams, RedisClientParams as P } from './redis-client.type'

/**
 * ### 名词解释
 *
 * 对于排序集 myzset { a: '2', c: '4.5' }
 *
 * - **key** 指整个排序集在 Redis 中存储的名称。如：myzset。
 * - **zset**, **排序集** 表示 Sorted Set。
 * - **member**, **成员**, **element**, **元素** 表示排序集内的元素名称。如：a, c。
 * - **score**, **分数** 表示排序集内元素对应的分数。如：2, 4.5。
 */
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

    /**
     * [[include:zset/zcard.md]]
     *
     * @category Sorted Set
     * @param key
     * @return
     */
    zcard(key: R.Key) {
        return this.send_command(new Command<R.NatureNumber>('ZCARD', [key]))
    }

    /**
     * [[include:zset/zcount.md]]
     *
     * @category Sorted Set
     * @param key
     * @param min 选取范围的最小值。
     * @param max 选取范围的最大值。
     * @return
     */
    zcount(key: R.Key, min: R.ZsetRangeScoreMin, max: R.ZsetRangeScoreMax) {
        return this.send_command(new Command<R.NatureNumber>('ZCOUNT', [key, min, max]))
    }

    /**
     * [[include:zset/zdiff.md]]
     *
     * @category Sorted Set
     * @param keys
     * @return - 数组形式返回一系列 member/score 对。
     */
    zdiff(keys: [R.Key, ...R.Key[]]): Promise<R.Key[]>
    /**
     * [[include:zset/zdiff.md]]
     *
     * @param keys
     * @param withscores 以 member/score 对形式返回结果。
     * @return - 数组形式返回一系列 member/score 对。
     */
    zdiff(keys: [R.Key, ...R.Key[]], withscores: true): Promise<R.MemberScoreArray>
    zdiff(keys: [R.Key, ...R.Key[]], withscores?: boolean) {
        const args = [keys.length + '', ...keys]
        if (withscores) {
            args.push('WITHSCORES')
        }
        return this.send_command(new Command<R.Key[] | R.MemberScoreArray>('ZDIFF', args))
    }

    /**
     * [[include:zset/zdiffstore.md]]
     *
     * @category Sorted Set
     * @param destination 用来存储结果的目标 key。
     * @param keys
     * @return - 返回存入 destination 的结果集的成员数量。
     */
    zdiffstore(destination: R.Key, keys: [R.Key, ...R.Key[]]) {
        return this.send_command(new Command<R.NatureNumber>('ZDIFFSTORE', [destination, keys.length + '', ...keys]))
    }

    /**
     * [[include:zset/zincrby.md]]
     *
     * @category Sorted Set
     * @param key
     * @param increment
     * @param member
     * @return - 返回计算后的 score，字符串形式的双精度浮点数。
     */
    zincrby(key: R.Key, increment: R.StringDoubleValue | number, member: R.Member) {
        return this.send_command(new Command<R.StringDoubleValue>('ZINCRBY', [key, increment + '', member]))
    }

    /**
     * [[include:zset/zinter.md]]
     *
     * @category Sorted Set
     * @param keys
     * @param options
     * @return - 返回交集计算的结果集。
     */
    zinter<T extends [R.Key, ...R.Key[]]>(keys: T, options?: P.ZinterOptions<T>): Promise<R.Member[]>
    /**
     * [[include:zset/zinter.md]]
     *
     * @param keys
     * @param withscores 以 member/score 对形式返回结果。
     * @param options
     * @return - 返回交集计算的结果集。
     */
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

    /**
     * [[include:zset/zinterstore.md]]
     *
     * @category Sorted Set
     * @param destination
     * @param keys
     * @param options
     * @return - 返回结果集中的元素数量。
     */
    zinterstore<T extends [R.Key, ...R.Key[]]>(destination: R.Key, keys: [R.Key, ...R.Key[]], options?: P.ZinterOptions<T>) {
        const args = [destination, keys.length + '', ...keys]
        options?.weights && args.push('WEIGHTS', ...options?.weights.map(w => w + ''))
        options?.aggregate && args.push('AGGREGATE', options?.aggregate)
        return this.send_command(new Command<R.NatureNumber>('ZINTERSTORE', args))
    }

    /**
     * [[include:zset/zlexcount.md]]
     *
     * @category Sorted Set
     * @param key
     * @param min 选取范围的最小值。
     * @param max 选取范围的最大值。
     * @return - 返回符合选择范围的成员数量。
     */
    zlexcount(key: R.Key, min: R.ZsetRangeMemberMin, max: R.ZsetRangeMemberMax) {
        return this.send_command(new Command<R.NatureNumber>('ZLEXCOUNT', [key, min, max]))
    }

    /**
     * [[include:zset/zmscore.md]]
     *
     * @category Sorted Set
     * @param key
     * @param members
     * @return
     */
    zmscore(key: R.Key, members: [R.Member, ...R.Member[]]) {
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

    /**
     * [[include:zset/zrange.md]]
     *
     * @category Sorted Set
     * @param key
     * @param range
     * @param options
     * @return
     */
    zrange(key: R.Key, range: { min: R.Integer, max: R.Integer }, options?: Pick<P.ZrangeOptions, 'reverse'>): Promise<R.Member[]>
    /**
     * [[include:zset/zrange.md]]
     *
     * @param key
     * @param range
     * @param withscores 以 member/score 对形式返回结果。
     * @param options
     * @return
     */
    zrange(key: R.Key, range: { min: R.Integer, max: R.Integer }, withscores: true, options?: Pick<P.ZrangeOptions, 'reverse'>): Promise<R.MemberScoreArray>
    /**
     * [[include:zset/zrange.md]]
     *
     * @param key
     * @param range
     * @param options
     * @return
     */
    zrange(key: R.Key, range: { by: 'BYLEX', min: R.ZsetRangeMemberMin, max: R.ZsetRangeMemberMax }, options?: P.ZrangeOptions): Promise<R.Member[]>
    /**
     * [[include:zset/zrange.md]]
     *
     * @param key
     * @param range
     * @param options
     * @return
     */
    zrange(key: R.Key, range: { by: 'BYSCORE', min: R.ZsetRangeScoreMin, max: R.ZsetRangeScoreMax }, options?: P.ZrangeOptions): Promise<R.Member[]>
    /**
     * [[include:zset/zrange.md]]
     *
     * @param key
     * @param range
     * @param withscores 以 member/score 对形式返回结果。
     * @param options
     * @return
     */
    zrange(key: R.Key, range: { by: 'BYSCORE', min: R.ZsetRangeScoreMin, max: R.ZsetRangeScoreMax }, withscores: true, options?: P.ZrangeOptions): Promise<R.MemberScoreArray>
    zrange(key: R.Key, range: { min: string | number, max: string | number, by?: P.ZrangeBy }, withscores?: true | P.ZrangeOptions, options?: P.ZrangeOptions) {
        const args = [key, range.min + '', range.max + '']
        if (withscores !== true) {
            options = withscores
            withscores = undefined
        }
        range.by && args.push(range.by)
        options?.reverse && args.push('REV')
        options?.limit && args.push('LIMIT', options.limit[0] + '', options.limit[1] + '')
        withscores && args.push('WITHSCORES')
        return this.send_command(new Command<R.Member[] | R.MemberScoreArray>('ZRANGE', args))
    }

    zrangebylex(key: R.Key, min: R.ZsetRangeMemberMin, max: R.ZsetRangeMemberMax, limit?: [R.Integer, R.Integer]) {
        const args = [key, min, max, ...(limit ? ['LIMIT', ...limit.map(a => a + '')] : [])]
        return this.send_command(new Command<R.MemberArray>('ZRANGEBYLEX', args))
    }

    /**
     * [[include:zset/zrangebyscore.md]]
     *
     * @category Sorted Set
     * @param key
     * @param min 选取范围的最小值。
     * @param max 选取范围的最大值。
     * @return
     */
    zrangebyscore(key: R.Key, min: R.ZsetRangeScoreMin, max: R.ZsetRangeScoreMax): Promise<R.Member[]>
    /**
     * [[include:zset/zrangebyscore.md]]
     *
     * @param key
     * @param min 选取范围的最小值。
     * @param max 选取范围的最大值。
     * @param withscores 以 member/score 对形式返回结果，2.0.0 版本开始可用。
     * @return
     */
    zrangebyscore(key: R.Key, min: R.ZsetRangeScoreMin, max: R.ZsetRangeScoreMax, withscores: true): Promise<R.MemberScoreArray>
    /**
     * [[include:zset/zrangebyscore.md]]
     *
     * @param key
     * @param min 选取范围的最小值。
     * @param max 选取范围的最大值。
     * @param limit 限制返回成员数量，格式为 offset, count
     * @return
     */
    zrangebyscore(key: R.Key, min: R.ZsetRangeScoreMin, max: R.ZsetRangeScoreMax, limit: [R.Integer, R.Integer]): Promise<R.Member[]>
    /**
     * [[include:zset/zrangebyscore.md]]
     *
     * @param key
     * @param min 选取范围的最小值。
     * @param max 选取范围的最大值。
     * @param limit 限制返回成员数量，格式为 offset, count
     * @param withscores 以 member/score 对形式返回结果，2.0.0 版本开始可用。
     * @return
     */
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

    /**
     * [[include:zset/zrangestore.md]]
     *
     * @category Sorted Set
     * @param dst
     * @param src
     * @param range
     * @param options
     * @return 返回存入 destination 的结果集的成员数量。
     */
    zrangestore(dst: R.Key, src: R.Key, range: { min: R.Integer, max: R.Integer }, options?: Pick<P.ZrangeOptions, 'reverse'>): Promise<R.NatureNumber>
    /**
     * [[include:zset/zrangestore.md]]
     *
     * @category Sorted Set
     * @param dst
     * @param src
     * @param range
     * @param options
     * @return 返回存入 destination 的结果集的成员数量。
     */
    zrangestore(dst: R.Key, src: R.Key, range: { by: 'BYLEX', min: R.ZsetRangeMemberMin, max: R.ZsetRangeMemberMax }, options?: Pick<P.ZrangeOptions, 'limit'>): Promise<R.NatureNumber>
    /**
     * [[include:zset/zrangestore.md]]
     *
     * @category Sorted Set
     * @param dst
     * @param src
     * @param range
     * @param options
     * @return 返回存入 destination 的结果集的成员数量。
     */
    zrangestore(dst: R.Key, src: R.Key, range: { by: 'BYSCORE', min: R.ZsetRangeScoreMin, max: R.ZsetRangeScoreMax }, options?: Pick<P.ZrangeOptions, 'limit'>): Promise<R.NatureNumber>
    zrangestore(dst: R.Key, src: R.Key, range: { min: string | number, max: string | number, by?: P.ZrangeBy }, options?: P.ZrangeOptions) {
        const args = [dst, src, range.min + '', range.max + '']
        range.by && args.push(range.by)
        options?.reverse && args.push('REV')
        options?.limit && args.push('LIMIT', options.limit[0] + '', options.limit[1] + '')
        return this.send_command(new Command<R.NatureNumber>('ZRANGESTORE', args))
    }

    /**
     * [[include:zset/zrank.md]]
     *
     * @category Sorted Set
     * @param key
     * @param member
     * @return
     */
    zrank(key: R.Key, member: R.Member) {
        return this.send_command(new Command<R.NatureNumber | null>('ZRANK', [key, member]))
    }

    /**
     * [[include:zset/zrem.md]]
     *
     * @category Sorted Set
     * @param key
     * @param members
     * @return
     */
    zrem(key: R.Key, members: [R.Member, ...R.Member[]]) {
        return this.send_command(new Command<R.NatureNumber>('ZREM', [key, ...members]))
    }

    /**
     * [[include:zset/zremrangebylex.md]]
     *
     * @category Sorted Set
     * @param key
     * @param min 选取范围的最小值。
     * @param max 选取范围的最大值。
     * @return
     */
    zremrangebylex(key: R.Key, min: R.ZsetRangeMemberMin, max: R.ZsetRangeMemberMax) {
        return this.send_command(new Command<R.NatureNumber>('ZREMRANGEBYLEX', [key, min, max]))
    }

    /**
     * [[include:zset/zremrangebyrank.md]]
     *
     * @category Sorted Set
     * @param key
     * @param start 选取范围索引开始位置。
     * @param stop 选取范围索引结束位置。
     * @return
     */
    zremrangebyrank(key: R.Key, start: R.Integer, stop: R.Integer) {
        return this.send_command(new Command<R.NatureNumber>('ZREMRANGEBYRANK', [key, start + '', stop + '']))
    }

    /**
     * [[include:zset/zremrangebyscore.md]]
     *
     * @category Sorted Set
     * @param key
     * @param min 选取范围的最小值。
     * @param max 选取范围的最大值。
     * @return
     */
    zremrangebyscore(key: R.Key, min: R.ZsetRangeScoreMin, max: R.ZsetRangeScoreMax) {
        return this.send_command(new Command<R.NatureNumber>('ZREMRANGEBYSCORE', [key, min, max]))
    }

    /**
     * [[include:zset/zrevrange.md]]
     *
     * @category Sorted Set
     * @param key
     * @param start 选取范围索引开始位置。
     * @param stop 选取范围索引结束位置。
     * @return
     */
    zrevrange(key: R.Key, start: R.Integer, stop: R.Integer): Promise<R.Member[]>
    /**
     * [[include:zset/zrevrange.md]]
     *
     * @param key
     * @param start 选取范围索引开始位置。
     * @param stop 选取范围索引结束位置。
     * @param withscores 以 member/score 对形式返回结果。
     * @return
     */
    zrevrange(key: R.Key, start: R.Integer, stop: R.Integer, withscores: true): Promise<R.MemberScoreArray>
    zrevrange(key: R.Key, start: R.Integer, stop: R.Integer, withscores?: true) {
        const args = [key, start + '', stop + '']
        if (withscores) {
            args.push('WITHSCORES')
        }
        return this.send_command(new Command<R.MemberArray>('ZREVRANGE', args))
    }

    /**
     * [[include:zset/zrevrangebylex.md]]
     *
     * @category Sorted Set
     * @param key
     * @param min 选取范围的最小值。
     * @param max 选取范围的最大值。
     * @param limit 限制返回成员数量，格式为 offset, count。
     * @return
     */
    zrevrangebylex(key: R.Key, min: R.ZsetRangeMemberMin, max: R.ZsetRangeMemberMax, limit?: [R.Integer, R.Integer]) {
        const args = [key, min, max, ...(limit ? ['LIMIT', ...limit.map(a => a + '')] : [])]
        return this.send_command(new Command<R.MemberArray>('ZREVRANGEBYLEX', args))
    }

    /**
     * [[include:zset/zrevrangebyscore.md]]
     *
     * @category Sorted Set
     * @param key
     * @param min 选取范围的最小值。
     * @param max 选取范围的最大值。
     * @return
     */
    zrevrangebyscore(key: R.Key, min: R.ZsetRangeScoreMin, max: R.ZsetRangeScoreMax): Promise<R.MemberScoreArray>
    /**
     * [[include:zset/zrevrangebyscore.md]]
     *
     * @param key
     * @param min 选取范围的最小值。
     * @param max 选取范围的最大值。
     * @param withscores 以 member/score 对形式返回结果。
     * @return
     */
    zrevrangebyscore(key: R.Key, min: R.ZsetRangeScoreMin, max: R.ZsetRangeScoreMax, withscores: true): Promise<R.MemberScoreArray>
    /**
     * [[include:zset/zrevrangebyscore.md]]
     *
     * @param key
     * @param min 选取范围的最小值。
     * @param max 选取范围的最大值。
     * @param limit 限制返回成员数量，格式为 offset, count。
     * @return
     */
    zrevrangebyscore(key: R.Key, min: R.ZsetRangeScoreMin, max: R.ZsetRangeScoreMax, limit: [R.Integer, R.Integer]): Promise<R.Member[]>
    /**
     * [[include:zset/zrevrangebyscore.md]]
     *
     * @param key
     * @param min 选取范围的最小值。
     * @param max 选取范围的最大值。
     * @param limit 限制返回成员数量，格式为 offset, count。
     * @param withscores 以 member/score 对形式返回结果。
     * @return
     */
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

    /**
     * [[include:zset/zrevrank.md]]
     *
     * @category Sorted Set
     * @param key
     * @param member
     * @return
     */
    zrevrank(key: R.Key, member: R.Member) {
        return this.send_command(new Command<R.NatureNumber | null>('ZREVRANK', [key, member]))
    }

    /**
     * [[include:zset/zscan.md]]
     *
     * @category Sorted Set
     * @param key
     * @param cursor
     * @param options
     * @return
     */
    zscan(key: R.Key, cursor: number, options?: RedisClientParams.ZScanOptions) {
        const args = [key, cursor + '']
        if (options?.match) {
            args.push('MATCH', options.match)
        }
        if (options?.count) {
            args.push('COUNT', options.count + '')
        }
        return this.send_command(new Command<R.KeyCount>('ZSCAN', args))
    }

    /**
     * [[include:zset/zscore.md]]
     *
     * @category Sorted Set
     * @param key
     * @param member
     * @return
     */
    zscore(key: R.Key, member: R.Member) {
        return this.send_command(new Command<R.StringDoubleValue, R.StringDoubleValue>('ZSCORE', [key, member]))
    }

    /**
     * [[include:zset/zunion.md]]
     *
     * @category Sorted Set
     * @param keys
     * @param options
     * @return
     */
    zunion<T extends [R.Key, ...R.Key[]]>(keys: T, options?: P.ZunionOptions<T>): Promise<R.Member[]>
    /**
     * [[include:zset/zunion.md]]
     *
     * @param keys
     * @param withscores 以 member/score 对形式返回结果。
     * @param options
     * @return
     */
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

    /**
     * [[include:zset/zunionstore.md]]
     *
     * @category Sorted Set
     * @param destination
     * @param keys
     * @param options
     * @return
     */
    zunionstore<T extends [R.Key, ...R.Key[]]>(destination: R.Key, keys: [R.Key, ...R.Key[]], options?: P.ZinterOptions<T>) {
        const args = [destination, keys.length + '', ...keys]
        options?.weights && args.push('WEIGHTS', ...options?.weights.map(w => w + ''))
        options?.aggregate && args.push('AGGREGATE', options?.aggregate)
        return this.send_command(new Command<R.NatureNumber>('ZUNIONSTORE', args))
    }
}
