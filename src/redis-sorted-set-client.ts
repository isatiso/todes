import { BaseClient } from './lib/client'
import { Command } from './lib/command'
import { RedisType as R, RedisUtilType as Util } from './lib/type'
import { RedisClientParams } from './redis-client.type'

export class RedisSortedSetClient extends BaseClient {

    /**
     * [[include:zset/zadd.md]]
     *
     * @category Sorted Set
     * @typeParam T
     * @param key
     * @param member_score_pair
     * @param options
     * @return
     */
    zadd<T extends { [key: string]: R.StringDoubleValue }>(key: R.Key, member_score_pair: Util.NonEmptyObject<T>, options?: RedisClientParams.ZaddOptions): Promise<R.NatureNumber>
    /**
     * [[include:zset/zadd.md]]
     *
     * @category Sorted Set
     * @typeParam T
     * @param key
     * @param member_score_pair
     * @param incr_mode
     * @param options
     * @return
     */
    zadd<T extends { [key: string]: R.StringDoubleValue }>(key: R.Key, member_score_pair: Util.NonEmptyObject<T>, incr_mode: true, options?: RedisClientParams.ZaddOptions): Promise<R.StringDoubleValue | null>
    zadd<T extends { [key: string]: R.StringDoubleValue }>(key: R.Key, member_score_pair: Util.NonEmptyObject<T>, incr_mode?: boolean | RedisClientParams.ZaddOptions, options?: RedisClientParams.ZaddOptions) {
        if (typeof incr_mode !== 'boolean') {
            options = incr_mode
            incr_mode = false
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
        return this.send_command(new Command<string | number | null>('ZADD', [...args, ...score_member_arr]))
    }

    zincrby(key: R.Key, increment: R.StringDoubleValue, member: R.Member): Promise<R.StringDoubleValue>
    zincrby(key: R.Key, increment: R.StringDoubleValue, member: R.Member, exists: 'XX' | 'NX'): Promise<R.StringDoubleValue | null>
    zincrby(key: R.Key, increment: R.StringDoubleValue, member: R.Member, exists?: 'XX' | 'NX') {
        if (exists !== undefined) {
            return this.send_command(new Command<R.StringDoubleValue | null>('ZADD', [key, exists, 'INCR', increment + '', member]))
        } else {
            return this.send_command(new Command<R.StringDoubleValue>('ZINCRBY', [key, increment + '', member]))
        }
    }

    zcard(key: R.Key) {
        return this.send_command(new Command<R.NatureNumber>('ZCARD', [key]))
    }

    zcount(key: R.Key, min: R.SortedSetRangeScoreMin, max: R.SortedSetRangeScoreMax) {
        return this.send_command(new Command<R.NatureNumber>('ZCOUNT', [key, min, max]))
    }

    zlexcount(key: R.Key, min: R.SortedSetRangeMemberMin, max: R.SortedSetRangeMemberMax) {
        return this.send_command(new Command<R.NatureNumber>('ZLEXCOUNT', [key, min, max]))
    }

    zpopmax(key: R.Key, count: R.NatureNumber = 1) {
        return this.send_command(new Command<R.MemberScoreArray>('ZPOPMAX', [key, count + '']))
    }

    zpopmin(key: R.Key, count: R.NatureNumber = 1) {
        return this.send_command(new Command<R.MemberScoreArray>('ZPOPMIN', [key, count + '']))
    }

    bzpopmax(keys: [R.Key, ...R.Key[]], timeout?: R.NatureNumber) {
        timeout && keys.push(timeout + '')
        return this.send_command(new Command<R.KeyMemberScore>('BZPOPMAX', [...keys]))
    }

    bzpopmin(keys: [R.Key, ...R.Key[]], timeout?: R.NatureNumber) {
        timeout && keys.push(timeout + '')
        return this.send_command(new Command<R.KeyMemberScore>('BZPOPMIN', [...keys]))
    }

    zrange(key: R.Key, start: R.Integer, stop: R.Integer) {
        return this.send_command(new Command<R.MemberArray>('ZRANGE', [key, start + '', stop + '']))
    }

    zrange_withscores(key: R.Key, start: R.Integer, stop: R.Integer) {
        const args = [key, start + '', stop + '', 'WITHSCORES']
        return this.send_command(new Command<R.MemberScoreArray>('ZRANGE', args))
    }

    zrangebylex(key: R.Key, min: R.SortedSetRangeMemberOpenMin, max: R.SortedSetRangeMemberOpenMax, limit?: [R.Integer, R.Integer]) {
        const args = [key, min, max, ...(limit ? ['LIMIT', ...limit.map(a => a + '')] : [])]
        return this.send_command(new Command<R.MemberArray>('ZRANGEBYLEX', args))
    }

    zrangebyscore(key: R.Key, min: R.SortedSetRangeScoreMin, max: R.SortedSetRangeScoreMax, limit?: [R.Integer, R.Integer]) {
        const args = [key, min, max, ...(limit ? ['LIMIT', ...limit.map(a => a + '')] : [])]
        return this.send_command(new Command<R.MemberArray>('ZRANGEBYSCORE', args))
    }

    zrangebyscore_withscores(key: R.Key, min: R.SortedSetRangeScoreMin, max: R.SortedSetRangeScoreMax, limit?: [R.Integer, R.Integer]) {
        const args = [key, min, max, 'WITHSCORES', ...(limit ? ['LIMIT', ...limit.map(a => a + '')] : [])]
        return this.send_command(new Command<R.MemberScoreArray>('ZRANGEBYSCORE', args))
    }

    zrevrange(key: R.Key, start: R.Integer, stop: R.Integer) {
        return this.send_command(new Command<R.MemberArray>('ZREVRANGE', [key, start + '', stop + '']))
    }

    zrevrange_withscores(key: R.Key, start: R.Integer, stop: R.Integer) {
        const args = [key, start + '', stop + '', 'WITHSCORES']
        return this.send_command(new Command<R.MemberScoreArray>('ZREVRANGE', args))
    }

    zrevrangebylex(key: R.Key, min: R.SortedSetRangeMemberOpenMin, max: R.SortedSetRangeMemberOpenMax, limit?: [R.Integer, R.Integer]) {
        const args = [key, min, max, ...(limit ? ['LIMIT', ...limit.map(a => a + '')] : [])]
        return this.send_command(new Command<R.MemberArray>('ZREVRANGEBYLEX', args))
    }

    zrevrangebyscore(key: R.Key, min: R.SortedSetRangeScoreMin, max: R.SortedSetRangeScoreMax, limit?: [R.Integer, R.Integer]) {
        const args = [key, min, max, ...(limit ? ['LIMIT', ...limit.map(a => a + '')] : [])]
        return this.send_command(new Command<R.MemberArray>('ZREVRANGEBYSCORE', args))
    }

    zrevrangebyscore_withscores(key: R.Key, min: R.SortedSetRangeScoreMin, max: R.SortedSetRangeScoreMax, limit?: [R.Integer, R.Integer]) {
        const args = [key, min, max, 'WITHSCORES', ...(limit ? ['LIMIT', ...limit.map(a => a + '')] : [])]
        return this.send_command(new Command<R.MemberScoreArray>('ZREVRANGEBYSCORE', args))
    }

    zrank(key: R.Key, member: R.Member) {
        return this.send_command(new Command<R.NatureNumber | null>('ZRANK', [key, member]))
    }

    zrevrank(key: R.Key, member: R.Member) {
        return this.send_command(new Command<R.NatureNumber | null>('ZREVRANK', [key, member]))
    }

    zrem(key: R.Key, member: R.Member, ...members: R.Member[]) {
        return this.send_command(new Command<R.NatureNumber>('ZREM', [key, member, ...members]))
    }

    zremrangebylex(key: R.Key, min: R.SortedSetRangeMemberOpenMin, max: R.SortedSetRangeMemberOpenMax) {
        return this.send_command(new Command<R.NatureNumber>('ZREMRANGEBYLEX', [key, min, max]))
    }

    zremrangebyrank(key: R.Key, start: R.Integer, stop: R.Integer) {
        return this.send_command(new Command<R.NatureNumber>('ZREMRANGEBYRANK', [key, start + '', stop + '']))
    }

    zremrangebyscore(key: R.Key, min: R.SortedSetRangeScoreMin, max: R.SortedSetRangeScoreMax) {
        return this.send_command(new Command<R.NatureNumber>('ZREMRANGEBYSCORE', [key, min, max]))
    }

    zscore(key: R.Key, member: R.Member) {
        return this.send_command(new Command<R.StringDoubleValue, R.StringDoubleValue>('ZSCORE', [key, member]))
    }

    zinterstore(destination: R.Key, keys: R.Key[], options?: { weights?: number[], aggregate?: 'SUM' | 'MIN' | 'MAX' }) {
        const args = [destination, keys.length + '', ...keys]
        if (options?.weights) {
            args.push('WEIGHTS', ...options?.weights.map(w => w + ''))
        }
        if (options?.aggregate) {
            args.push('AGGREGATE', options?.aggregate)
        }
        return this.send_command(new Command<R.NatureNumber>('ZINTERSTORE', args))
    }

    zunionstore(destination: R.Key, keys: R.Key[], options?: { weights?: number[], aggregate?: 'SUM' | 'MIN' | 'MAX' }) {
        const args = [destination, keys.length + '', ...keys]
        if (options?.weights) {
            args.push('WEIGHTS', ...options?.weights.map(w => w + ''))
        }
        if (options?.aggregate) {
            args.push('AGGREGATE', options?.aggregate)
        }
        return this.send_command(new Command<R.NatureNumber>('ZUNIONSTORE', args))
    }
}
