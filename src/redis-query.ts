import { RedisClient } from './lib/client'
import { Command, CommandOptions } from './lib/command'
import { CommandInfo, RedisClientOptions, RedisType as R } from './lib/type'

function parse_command_info(command_info: any[]) {
    return Object.fromEntries(command_info.map(
        t => [t[0], { name: t[0], args_count: t[1], flag: t[2], first_key: t[3], last_key: t[4], key_step: t[5] }]))
}

export class RedisQuery extends RedisClient {

    constructor(options: RedisClientOptions) {
        super(options)
    }

    // keys

    type(key: R.Key) {
        return this.send_command(new Command<R.RedisValueType>('TYPE', [key]))
    }

    ttl(key: R.Key) {
        return this.send_command(new Command<R.TTL>('TTL', [key]))
    }

    pttl(key: R.Key) {
        return this.send_command(new Command<R.PTTL>('PTTL', [key]))
    }

    expire(key: R.Key, ttl: R.TTL) {
        return this.send_command(new Command<R.Bit>('EXPIRE', [key, ttl + '']))
    }

    expireat(key: R.Key, timestamp: R.Timestamp) {
        return this.send_command(new Command<R.Bit>('EXPIREAT', [key, timestamp + '']))
    }

    pexpire(key: R.Key, ttl: R.PTTL) {
        return this.send_command(new Command<R.Bit>('PEXPIRE', [key, ttl + '']))
    }

    pexpireat(key: R.Key, timestamp: R.MilliTimestamp) {
        return this.send_command(new Command<R.Bit>('PEXPIREAT', [key, timestamp + '']))
    }

    // string

    append(key: R.Key, value: R.StringValue) {
        return this.send_command(new Command<R.KeyCount>('APPEND', [key, value]))
    }

    randomkey() {
        return this.send_command(new Command<R.Key | null>('RANDOMKEY', []))
    }

    flushdb() {
        return this.send_command(new Command<'OK'>('FLUSHDB', []))
    }

    keys(pattern: R.KeyPattern) {
        return this.send_command(new Command<R.Key[]>('KEYS', [pattern]))
    }

    get(key: R.Key, options?: CommandOptions) {
        return this.send_command(new Command<R.StringValue | null>('GET', [key], options))
    }

    del(key: R.Key, ...keys: R.Key[]) {
        return this.send_command(new Command<R.KeyCount>('DEL', [key, ...keys]))
    }

    set(key: R.Key, value: R.StringValue): Promise<'OK'>
    set(key: R.Key, value: R.StringValue, expires: R.PositiveInteger): Promise<'OK'>
    set(key: R.Key, value: R.StringValue, exists: 'XX' | 'NX'): Promise<'OK' | null>
    set(key: R.Key, value: R.StringValue, exists: 'XX' | 'NX', expires: R.PositiveInteger): Promise<'OK' | null>
    set(key: R.Key, value: R.StringValue, exists?: 'XX' | 'NX' | number | undefined, expires?: number) {
        const args = [key, value]
        if (typeof exists === 'number') {
            args.push('EX', exists + '')
        } else if (exists) {
            args.push(exists)
        }
        if (expires && !args.includes('EX')) {
            args.push('EX', expires + '')
        }
        return this.send_command(new Command<'OK' | null>('SET', args))
    }

    setnx(key: R.Key, value: R.StringValue) {
        return this.send_command(new Command<R.Bit>('SETNX', [key, value]))
    }

    setex(key: R.Key, value: R.StringValue, ttl: R.Integer) {
        return this.send_command(new Command<'OK'>('SETEX', [key, ttl + '', value]))
    }

    incr(key: R.Key) {
        return this.send_command(new Command<R.Integer>('INCR', [key]))
    }

    incrby(key: R.Key, increment: R.Integer) {
        return this.send_command(new Command<R.Integer>('INCRBY', [key, increment + '']))
    }

    incrbyfloat(key: R.Key, increment: R.StringDoubleValue) {
        return this.send_command(new Command<R.StringDoubleValue>('INCRBYFLOAT', [key, increment + '']))
    }

    decr(key: R.Key) {
        return this.send_command(new Command<R.Integer>('DECR', [key]))
    }

    decrby(key: R.Key, decrement: R.Integer) {
        return this.send_command(new Command<R.Integer>('DECRBY', [key, decrement + '']))
    }

    getset(key: R.Key, value: R.StringValue, options?: CommandOptions) {
        return this.send_command(new Command<R.StringValue | null>('GETSET', [key, value], options))
    }

    mget(keys: [R.Key, ...R.Key[]], options?: CommandOptions) {
        return this.send_command(new Command<(R.StringValue | null)[]>('MGET', keys, options))
    }

    mset(kvs: [R.Key, R.StringValue, ...string[]]) {
        return this.send_command(new Command<'OK'>('MSET', kvs))
    }

    msetnx(kvs: [R.Key, R.StringValue, ...string[]]) {
        return this.send_command(new Command<R.Bit>('MSETNX', kvs))
    }

    psetex(key: R.Key, value: R.StringValue, milli_ex: R.Integer) {
        return this.send_command(new Command<'OK'>('PSETEX', [key, milli_ex + '', value]))
    }

    bitcount(key: R.Key, range?: [R.Integer, R.Integer]) {
        const args = range ? [key, range[0] + '', range[1] + ''] : [key]
        return this.send_command(new Command<R.Integer>('BITCOUNT', args))
    }

    bitop(operation: 'AND' | 'OR' | 'XOR' | 'NOT', dest: R.Key, keys: [R.Key, ...R.Key[]]) {
        return this.send_command(new Command<R.NatureNumber>('BITOP', [operation, dest, ...keys]))
    }

    bitpos(key: R.Key, bit: R.Bit): Promise<R.NatureNumber | -1>
    bitpos(key: R.Key, bit: R.Bit, start: R.Integer): Promise<R.NatureNumber | -1>
    bitpos(key: R.Key, bit: R.Bit, start: R.Integer, end: R.Integer): Promise<R.NatureNumber | -1>
    bitpos(key: R.Key, bit: R.Bit, start?: R.Integer, end?: R.Integer) {
        const args = [key, bit + '']
        start && args.push(start.toString())
        end && args.push(end.toString())
        return this.send_command(new Command<R.NatureNumber | -1>('BITPOS', args))
    }

    bitfield(key: R.Key, pipeline: [R.BitFieldPipelineCommand, ...R.BitFieldPipelineCommand[]]) {
        const args = [key]
        pipeline.forEach((cmd: any[]) => args.push(...cmd.map(c => c + '')))
        return this.send_command(new Command<R.Integer[]>('BITFIELD', args))
    }

    getbit(key: R.Key, offset: R.NatureNumber) {
        return this.send_command(new Command<R.Bit>('GETBIT', [key, offset + '']))
    }

    setbit(key: R.Key, offset: R.NatureNumber, value: R.Bit) {
        return this.send_command(new Command<R.Bit>('SETBIT', [key, offset + '', value + '']))
    }

    getrange(key: R.Key, start: R.Integer, end: R.Integer) {
        return this.send_command(new Command<R.StringValue>('GETRANGE', [key, start + '', end + '']))
    }

    setrange(key: R.Key, offset: R.NatureNumber, value: R.StringValue) {
        return this.send_command(new Command<R.NatureNumber>('SETRANGE', [key, offset + '', value]))
    }

    strlen(key: R.Key) {
        return this.send_command(new Command<R.NatureNumber>('STRLEN', [key]))
    }

    // Hash Set

    hdel(key: R.Key, field: R.Field, ...fields: R.Field[]) {
        return this.send_command(new Command<R.NatureNumber>('HDEL', [key, field, ...fields]))
    }

    hexists(key: R.Key, field: R.Field) {
        return this.send_command(new Command<R.Bit>('HEXISTS', [key, field]))
    }

    hget(key: R.Key, field: R.Field) {
        return this.send_command(new Command<R.StringValue | null>('HGET', [key, field]))
    }

    hset(key: R.Key, field: R.Field, value: R.StringValue) {
        return this.send_command(new Command<R.Bit>('HSET', [key, field, value]))
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

    hmget(key: R.Key, field: R.Field, ...fields: R.Field[]) {
        return this.send_command(new Command<R.StringValue[]>('HMGET', [key, field, ...fields]))
    }

    hmset(key: R.Key, kvs: [R.Field, R.StringValue, ...string[]]) {
        return this.send_command(new Command<'OK', 'OK'>('HMSET', [key, ...kvs]))
    }

    hincrby(key: R.Key, field: R.Field, increment: R.Integer) {
        return this.send_command(new Command<R.Integer>('HINCRBY', [key, field, increment + '']))
    }

    hincrbyfloat(key: R.Key, field: R.Field, increment: R.StringDoubleValue) {
        return this.send_command(new Command<R.StringDoubleValue>('HINCRBYFLOAT', [key, field, increment + '']))
    }

    // TODO: HSCAN‚

    hgetall(key: R.Key) {
        return this.send_command(new Command<string[], { [field: string]: R.StringValue }>('HGETALL', [key], undefined, (data: string[]) => {
            const res: any = {}
            for (let i = 0; i < data.length; i += 2) {
                res[data[i]] = data[i + 1]
            }
            return res
        }))
    }

    // List

    llen(key: R.Key) {
        return this.send_command(new Command<R.NatureNumber>('LLEN', [key]))
    }

    lset(key: R.Key, index: R.Integer, value: R.StringValue) {
        return this.send_command(new Command<'OK', 'OK'>('LSET', [key, index + '', value]))
    }

    lrem(key: R.Key, count: R.Integer, value: R.StringValue) {
        return this.send_command(new Command<R.NatureNumber>('LREM', [key, count + '', value]))
    }

    linsert(key: R.Key, pos: 'BEFORE' | 'AFTER', pivot: R.StringValue, value: R.StringValue) {
        return this.send_command(new Command<R.NatureNumber | -1>('LINSERT', [key, pos, pivot, value]))
    }

    ltrim(key: R.Key, start: R.Integer, stop: R.Integer) {
        return this.send_command(new Command<'OK'>('LTRIM', [key, start + '', stop + '']))
    }

    lrange(key: R.Key, start: R.Integer, stop: R.Integer) {
        return this.send_command(new Command<R.StringValue[]>('LRANGE', [key, start + '', stop + '']))
    }

    lindex(key: R.Key, index: R.Integer) {
        return this.send_command(new Command<R.StringValue | null>('LINDEX', [key, index + '']))
    }

    lpop(key: R.Key) {
        return this.send_command(new Command<R.StringValue | null>('LPOP', [key]))
    }

    lpush(key: R.Key, value: R.StringValue, ...values: R.StringValue[]) {
        return this.send_command(new Command<R.Integer>('LPUSH', [key, value, ...values]))
    }

    lpushx(key: R.Key, value: R.StringValue, ...values: R.StringValue[]) {
        return this.send_command(new Command<R.Integer>('LPUSHX', [key, value, ...values]))
    }

    rpop(key: R.Key) {
        return this.send_command(new Command<R.StringValue | null>('RPOP', [key]))
    }

    rpush(key: R.Key, value: R.StringValue, ...values: R.StringValue[]) {
        return this.send_command(new Command<R.Integer>('RPUSH', [key, value, ...values]))
    }

    rpushx(key: R.Key, value: R.StringValue, ...values: R.StringValue[]) {
        return this.send_command(new Command<R.Integer>('RPUSHX', [key, value, ...values]))
    }

    rpoplpush(source: R.Key, destination: R.Key) {
        return this.send_command(new Command<R.StringValue | null>('RPOPLPUSH', [source, destination]))
    }

    blpop(keys: [R.Key, ...R.Key[]], timeout: R.NatureNumber) {
        return this.send_command(new Command<R.StringValue[] | null>('BLPOP', [...keys, timeout + '']))
    }

    brpop(keys: [R.Key, ...R.Key[]], timeout: R.NatureNumber) {
        return this.send_command(new Command<R.StringValue[] | null>('BRPOP', [...keys, timeout + '']))
    }

    brpoplpush(source: R.Key, destination: R.Key, timeout: R.NatureNumber) {
        return this.send_command(new Command<R.StringValue | null>('BRPOPLPUSH', [source, destination, timeout + '']))
    }

    // Sets

    sadd(key: R.Key, member: R.Member, ...members: R.Member[]) {
        return this.send_command(new Command<R.PositiveInteger>('SADD', [key, member, ...members]))
    }

    scard(key: R.Key) {
        return this.send_command(new Command<R.NatureNumber>('SCARD', [key]))
    }

    sdiff(key: R.Key, ...keys: R.Key[]) {
        return this.send_command(new Command<R.Member[]>('SDIFF', [key, ...keys]))
    }

    sdiffstore(destination: R.Key, key: R.Key, ...keys: R.Key[]) {
        return this.send_command(new Command<R.NatureNumber>('SDIFFSTORE', [destination, key, ...keys]))
    }

    sinter(key: R.Key, ...keys: R.Key[]) {
        return this.send_command(new Command<R.Member[]>('SINTER', [key, ...keys]))
    }

    sinterstore(destination: R.Key, key: R.Key, ...keys: R.Key[]) {
        return this.send_command(new Command<R.NatureNumber>('SINTERSTORE', [destination, key, ...keys]))
    }

    sunion(key: R.Key, ...keys: R.Key[]) {
        return this.send_command(new Command<R.Member[]>('SUNION', [key, ...keys]))
    }

    sunionstore(destination: R.Key, key: R.Key, ...keys: R.Key[]) {
        return this.send_command(new Command<R.NatureNumber>('SUNIONSTORE', [destination, key, ...keys]))
    }

    sismember(key: R.Key, member: R.Member) {
        return this.send_command(new Command<R.Bit>('SISMEMBER', [key, member]))
    }

    smembers(key: R.Key) {
        return this.send_command(new Command<R.Member[]>('SMEMBERS', [key]))
    }

    smove(source: R.Key, destination: R.Key, member: R.Member) {
        return this.send_command(new Command<R.Bit>('SMOVE', [source, destination, member]))
    }

    spop(key: R.Key): Promise<R.Member | null>
    spop(key: R.Key, count: R.NatureNumber): Promise<R.Member[]>
    spop(key: R.Key, count?: R.NatureNumber) {
        const args = [key]
        if (count !== undefined) {
            args.push(count + '')
        }
        return this.send_command(new Command<R.Member[] | R.Member | null>('SPOP', args))
    }

    srandmember(key: R.Key): Promise<R.Member | null>
    srandmember(key: R.Key, count: R.Integer): Promise<R.Member[]>
    srandmember(key: R.Key, count?: R.Integer) {
        const args = [key]
        if (count !== undefined) {
            args.push(count + '')
        }
        return this.send_command(new Command<R.Member[] | R.Member | null>('SRANDMEMBER', args))
    }

    srem(key: R.Key, member: R.Member, ...members: R.Member[]) {
        return this.send_command(new Command<R.NatureNumber>('SREM', [key, member, ...members]))
    }

    // TODO: SSCAN‚

    // Sorted Sets

    zadd(key: R.Key, members: R.ScoreMemberArray, ...options: ('XX' | 'NX' | 'CH')[]) {
        return this.send_command(new Command<R.NatureNumber>('ZADD', [key, ...Array.from(new Set(options)), ...members]))
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

    // Server

    command() {
        return this.send_command(new Command<any[], { [key: string]: CommandInfo }>('COMMAND', [], undefined, data => parse_command_info(data)))
    }

    command_info(command: string, ...commands: string[]) {
        return this.send_command(new Command<any[], { [key: string]: CommandInfo }>('COMMAND', ['INFO', command, ...commands], undefined, data => parse_command_info(data)))
    }

    command_count() {
        return this.send_command(new Command<number, number>('COMMAND', ['COUNT']))
    }

    // command_getkeys() {
    //     return this.send_command(new Command<string[], string[]>('COMMAND', ['GETKEYS']))
    // }
}
