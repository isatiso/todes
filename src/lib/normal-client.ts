import { RedisClient } from './client'
import { Command, CommandOptions } from './command'
import { CommandInfo, RedisClientOptions, RedisType } from './type'
import Bit = RedisType.Bit
import BitFieldPipelineCommand = RedisType.BitFieldPipelineCommand
import Field = RedisType.Field
import Integer = RedisType.Integer
import Key = RedisType.Key
import KeyCount = RedisType.KeyCount
import KeyMemberScore = RedisType.KeyMemberScore
import KeyPattern = RedisType.KeyPattern
import Member = RedisType.Member
import MemberArray = RedisType.MemberArray
import MemberScoreArray = RedisType.MemberScoreArray
import NatureNumber = RedisType.NatureNumber
import PositiveInteger = RedisType.PositiveInteger
import PTTL = RedisType.PTTL
import ScoreMemberArray = RedisType.ScoreMemberArray
import StringDoubleValue = RedisType.StringDoubleValue
import StringValue = RedisType.StringValue
import TTL = RedisType.TTL
import SortedSetRangeScoreMin = RedisType.SortedSetRangeScoreMin
import SortedSetRangeScoreMax = RedisType.SortedSetRangeScoreMax
import SortedSetRangeMemberMin = RedisType.SortedSetRangeMemberMin
import SortedSetRangeMemberMax = RedisType.SortedSetRangeMemberMax
import SortedSetRangeMemberOpenMin = RedisType.SortedSetRangeMemberOpenMin
import SortedSetRangeMemberOpenMax = RedisType.SortedSetRangeMemberOpenMax

function parse_command_info(command_info: any[]) {
    return Object.fromEntries(command_info.map(
        t => [t[0], { name: t[0], args_count: t[1], flag: t[2], first_key: t[3], last_key: t[4], key_step: t[5] }]))
}

export class NormalRedisClient extends RedisClient {

    constructor(options: RedisClientOptions) {
        super(options)
    }

    // string

    append(key: Key, value: StringValue) {
        return this.send_command(new Command<KeyCount>('APPEND', [key, value]))
    }

    randomkey() {
        return this.send_command(new Command<Key | null>('RANDOMKEY', []))
    }

    flushdb() {
        return this.send_command(new Command<'OK'>('FLUSHDB', []))
    }

    keys(pattern: KeyPattern) {
        return this.send_command(new Command<Key[]>('KEYS', [pattern]))
    }

    get(key: Key, options?: CommandOptions) {
        return this.send_command(new Command<StringValue | null>('GET', [key], options))
    }

    del(key: Key, ...keys: Key[]) {
        return this.send_command(new Command<KeyCount>('DEL', [key, ...keys]))
    }

    set(key: Key, value: StringValue): Promise<'OK'>
    set(key: Key, value: StringValue, expires: PositiveInteger): Promise<'OK'>
    set(key: Key, value: StringValue, exists: 'XX' | 'NX'): Promise<'OK' | null>
    set(key: Key, value: StringValue, exists: 'XX' | 'NX', expires: PositiveInteger): Promise<'OK' | null>
    set(key: Key, value: StringValue, exists?: 'XX' | 'NX' | number | undefined, expires?: number) {
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

    setnx(key: Key, value: StringValue) {
        return this.send_command(new Command<Bit>('SETNX', [key, value]))
    }

    setex(key: Key, value: StringValue, ttl: Integer) {
        return this.send_command(new Command<'OK'>('SETEX', [key, ttl + '', value]))
    }

    ttl(key: Key) {
        return this.send_command(new Command<TTL>('TTL', [key]))
    }

    pttl(key: Key) {
        return this.send_command(new Command<PTTL>('PTTL', [key]))
    }

    incr(key: Key) {
        return this.send_command(new Command<Integer>('INCR', [key]))
    }

    incrby(key: Key, increment: Integer) {
        return this.send_command(new Command<Integer>('INCRBY', [key, increment + '']))
    }

    incrbyfloat(key: Key, increment: StringDoubleValue) {
        return this.send_command(new Command<StringDoubleValue>('INCRBYFLOAT', [key, increment + '']))
    }

    decr(key: Key) {
        return this.send_command(new Command<Integer>('DECR', [key]))
    }

    decrby(key: Key, decrement: Integer) {
        return this.send_command(new Command<Integer>('DECRBY', [key, decrement + '']))
    }

    getset(key: Key, value: StringValue, options?: CommandOptions) {
        return this.send_command(new Command<StringValue | null>('GETSET', [key, value], options))
    }

    mget(keys: [Key, ...Key[]], options?: CommandOptions) {
        return this.send_command(new Command<(StringValue | null)[]>('MGET', keys, options))
    }

    mset(kvs: [Key, StringValue, ...string[]]) {
        return this.send_command(new Command<'OK'>('MSET', kvs))
    }

    msetnx(kvs: [Key, StringValue, ...string[]]) {
        return this.send_command(new Command<Bit>('MSETNX', kvs))
    }

    psetex(key: Key, value: StringValue, milli_ex: Integer) {
        return this.send_command(new Command<'OK'>('PSETEX', [key, milli_ex + '', value]))
    }

    bitcount(key: Key, range?: [Integer, Integer]) {
        const args = range ? [key, range[0] + '', range[1] + ''] : [key]
        return this.send_command(new Command<Integer>('BITCOUNT', args))
    }

    bitop(operation: 'AND' | 'OR' | 'XOR' | 'NOT', dest: Key, keys: [Key, ...Key[]]) {
        return this.send_command(new Command<NatureNumber>('BITOP', [operation, dest, ...keys]))
    }

    bitpos(key: Key, bit: Bit): Promise<NatureNumber | -1>
    bitpos(key: Key, bit: Bit, start: Integer): Promise<NatureNumber | -1>
    bitpos(key: Key, bit: Bit, start: Integer, end: Integer): Promise<NatureNumber | -1>
    bitpos(key: Key, bit: Bit, start?: Integer, end?: Integer) {
        const args = [key, bit + '']
        start && args.push(start.toString())
        end && args.push(end.toString())
        return this.send_command(new Command<NatureNumber | -1>('BITPOS', args))
    }

    bitfield(key: Key, pipeline: [BitFieldPipelineCommand, ...BitFieldPipelineCommand[]]) {
        const args = [key]
        pipeline.forEach((cmd: any[]) => args.push(...cmd.map(c => c + '')))
        return this.send_command(new Command<Integer[]>('BITFIELD', args))
    }

    getbit(key: Key, offset: NatureNumber) {
        return this.send_command(new Command<Bit>('GETBIT', [key, offset + '']))
    }

    setbit(key: Key, offset: NatureNumber, value: Bit) {
        return this.send_command(new Command<Bit>('SETBIT', [key, offset + '', value + '']))
    }

    getrange(key: Key, start: Integer, end: Integer) {
        return this.send_command(new Command<StringValue>('GETRANGE', [key, start + '', end + '']))
    }

    setrange(key: Key, offset: NatureNumber, value: StringValue) {
        return this.send_command(new Command<NatureNumber>('SETRANGE', [key, offset + '', value]))
    }

    strlen(key: Key) {
        return this.send_command(new Command<NatureNumber>('STRLEN', [key]))
    }

    // Hash Set

    hdel(key: Key, field: Field, ...fields: Field[]) {
        return this.send_command(new Command<NatureNumber>('HDEL', [key, field, ...fields]))
    }

    hexists(key: Key, field: Field) {
        return this.send_command(new Command<Bit>('HEXISTS', [key, field]))
    }

    hget(key: Key, field: Field) {
        return this.send_command(new Command<StringValue | null>('HGET', [key, field]))
    }

    hset(key: Key, field: Field, value: StringValue) {
        return this.send_command(new Command<Bit>('HSET', [key, field, value]))
    }

    hsetnx(key: Key, field: Field, value: StringValue) {
        return this.send_command(new Command<Bit>('HSETNX', [key, field, value]))
    }

    hkeys(key: Key) {
        return this.send_command(new Command<Field[]>('HKEYS', [key]))
    }

    hvals(key: Key) {
        return this.send_command(new Command<StringValue[]>('HVALS', [key]))
    }

    hlen(key: Key) {
        return this.send_command(new Command<NatureNumber>('HLEN', [key]))
    }

    hstrlen(key: Key, field: Field) {
        return this.send_command(new Command<NatureNumber>('HSTRLEN', [key, field]))
    }

    hmget(key: Key, field: Field, ...fields: Field[]) {
        return this.send_command(new Command<StringValue[]>('HMGET', [key, field, ...fields]))
    }

    hmset(key: Key, kvs: [Field, StringValue, ...string[]]) {
        return this.send_command(new Command<'OK', 'OK'>('HMSET', [key, ...kvs]))
    }

    hincrby(key: Key, field: Field, increment: Integer) {
        return this.send_command(new Command<Integer>('HINCRBY', [key, field, increment + '']))
    }

    hincrbyfloat(key: Key, field: Field, increment: StringDoubleValue) {
        return this.send_command(new Command<StringDoubleValue>('HINCRBYFLOAT', [key, field, increment + '']))
    }

    // TODO: HSCAN‚

    hgetall(key: Key) {
        return this.send_command(new Command<string[], { [field: string]: StringValue }>('HGETALL', [key], undefined, (data: string[]) => {
            const res: any = {}
            for (let i = 0; i < data.length; i += 2) {
                res[data[i]] = data[i + 1]
            }
            return res
        }))
    }

    // List

    llen(key: Key) {
        return this.send_command(new Command<NatureNumber>('LLEN', [key]))
    }

    lset(key: Key, index: Integer, value: StringValue) {
        return this.send_command(new Command<'OK', 'OK'>('LSET', [key, index + '', value]))
    }

    lrem(key: Key, count: Integer, value: StringValue) {
        return this.send_command(new Command<NatureNumber>('LREM', [key, count + '', value]))
    }

    linsert(key: Key, pos: 'BEFORE' | 'AFTER', pivot: StringValue, value: StringValue) {
        return this.send_command(new Command<NatureNumber | -1>('LINSERT', [key, pos, pivot, value]))
    }

    ltrim(key: Key, start: Integer, stop: Integer) {
        return this.send_command(new Command<'OK'>('LTRIM', [key, start + '', stop + '']))
    }

    lrange(key: Key, start: Integer, stop: Integer) {
        return this.send_command(new Command<StringValue[]>('LRANGE', [key, start + '', stop + '']))
    }

    lindex(key: Key, index: Integer) {
        return this.send_command(new Command<StringValue | null>('LINDEX', [key, index + '']))
    }

    lpop(key: Key) {
        return this.send_command(new Command<StringValue | null>('LPOP', [key]))
    }

    lpush(key: Key, value: StringValue, ...values: StringValue[]) {
        return this.send_command(new Command<Integer>('LPUSH', [key, value, ...values]))
    }

    lpushx(key: Key, value: StringValue, ...values: StringValue[]) {
        return this.send_command(new Command<Integer>('LPUSHX', [key, value, ...values]))
    }

    rpop(key: Key) {
        return this.send_command(new Command<StringValue | null>('RPOP', [key]))
    }

    rpush(key: Key, value: StringValue, ...values: StringValue[]) {
        return this.send_command(new Command<Integer>('RPUSH', [key, value, ...values]))
    }

    rpushx(key: Key, value: StringValue, ...values: StringValue[]) {
        return this.send_command(new Command<Integer>('RPUSHX', [key, value, ...values]))
    }

    rpoplpush(source: Key, destination: Key) {
        return this.send_command(new Command<StringValue | null>('RPOPLPUSH', [source, destination]))
    }

    blpop(keys: [Key, ...Key[]], timeout: NatureNumber) {
        return this.send_command(new Command<StringValue[] | null>('BLPOP', [...keys, timeout + '']))
    }

    brpop(keys: [Key, ...Key[]], timeout: NatureNumber) {
        return this.send_command(new Command<StringValue[] | null>('BRPOP', [...keys, timeout + '']))
    }

    brpoplpush(source: Key, destination: Key, timeout: NatureNumber) {
        return this.send_command(new Command<StringValue | null>('BRPOPLPUSH', [source, destination, timeout + '']))
    }

    // Sets

    sadd(key: Key, member: Member, ...members: Member[]) {
        return this.send_command(new Command<PositiveInteger>('SADD', [key, member, ...members]))
    }

    scard(key: Key) {
        return this.send_command(new Command<NatureNumber>('SCARD', [key]))
    }

    sdiff(key: Key, ...keys: Key[]) {
        return this.send_command(new Command<Member[]>('SDIFF', [key, ...keys]))
    }

    sdiffstore(destination: Key, key: Key, ...keys: Key[]) {
        return this.send_command(new Command<NatureNumber>('SDIFFSTORE', [destination, key, ...keys]))
    }

    sinter(key: Key, ...keys: Key[]) {
        return this.send_command(new Command<Member[]>('SINTER', [key, ...keys]))
    }

    sinterstore(destination: Key, key: Key, ...keys: Key[]) {
        return this.send_command(new Command<NatureNumber>('SINTERSTORE', [destination, key, ...keys]))
    }

    sunion(key: Key, ...keys: Key[]) {
        return this.send_command(new Command<Member[]>('SUNION', [key, ...keys]))
    }

    sunionstore(destination: Key, key: Key, ...keys: Key[]) {
        return this.send_command(new Command<NatureNumber>('SUNIONSTORE', [destination, key, ...keys]))
    }

    sismember(key: Key, member: Member) {
        return this.send_command(new Command<Bit>('SISMEMBER', [key, member]))
    }

    smembers(key: Key) {
        return this.send_command(new Command<Member[]>('SMEMBERS', [key]))
    }

    smove(source: Key, destination: Key, member: Member) {
        return this.send_command(new Command<Bit>('SMOVE', [source, destination, member]))
    }

    spop(key: Key): Promise<Member | null>
    spop(key: Key, count: NatureNumber): Promise<Member[]>
    spop(key: Key, count?: NatureNumber) {
        const args = [key]
        if (count !== undefined) {
            args.push(count + '')
        }
        return this.send_command(new Command<Member[] | Member | null>('SPOP', args))
    }

    srandmember(key: Key): Promise<Member | null>
    srandmember(key: Key, count: Integer): Promise<Member[]>
    srandmember(key: Key, count?: Integer) {
        const args = [key]
        if (count !== undefined) {
            args.push(count + '')
        }
        return this.send_command(new Command<Member[] | Member | null>('SRANDMEMBER', args))
    }

    srem(key: Key, member: Member, ...members: Member[]) {
        return this.send_command(new Command<NatureNumber>('SREM', [key, member, ...members]))
    }

    // TODO: SSCAN‚

    // Sorted Sets

    zadd(key: Key, members: ScoreMemberArray, ...options: ('XX' | 'NX' | 'CH')[]) {
        return this.send_command(new Command<NatureNumber>('ZADD', [key, ...Array.from(new Set(options)), ...members]))
    }

    zincrby(key: Key, increment: StringDoubleValue, member: Member): Promise<StringDoubleValue>
    zincrby(key: Key, increment: StringDoubleValue, member: Member, exists: 'XX' | 'NX'): Promise<StringDoubleValue | null>
    zincrby(key: Key, increment: StringDoubleValue, member: Member, exists?: 'XX' | 'NX') {
        if (exists !== undefined) {
            return this.send_command(new Command<StringDoubleValue | null>('ZADD', [key, exists, 'INCR', increment + '', member]))
        } else {
            return this.send_command(new Command<StringDoubleValue>('ZINCRBY', [key, increment + '', member]))
        }
    }

    zcard(key: Key) {
        return this.send_command(new Command<NatureNumber>('ZCARD', [key]))
    }

    zcount(key: Key, min: SortedSetRangeScoreMin, max: SortedSetRangeScoreMax) {
        return this.send_command(new Command<NatureNumber>('ZCOUNT', [key, min, max]))
    }

    zlexcount(key: Key, min: SortedSetRangeMemberMin, max: SortedSetRangeMemberMax) {
        return this.send_command(new Command<NatureNumber>('ZLEXCOUNT', [key, min, max]))
    }

    zpopmax(key: Key, count: NatureNumber = 1) {
        return this.send_command(new Command<MemberScoreArray>('ZPOPMAX', [key, count + '']))
    }

    zpopmin(key: Key, count: NatureNumber = 1) {
        return this.send_command(new Command<MemberScoreArray>('ZPOPMIN', [key, count + '']))
    }

    bzpopmax(keys: [Key, ...Key[]], timeout?: NatureNumber) {
        timeout && keys.push(timeout + '')
        return this.send_command(new Command<KeyMemberScore>('BZPOPMAX', [...keys]))
    }

    bzpopmin(keys: [Key, ...Key[]], timeout?: NatureNumber) {
        timeout && keys.push(timeout + '')
        return this.send_command(new Command<KeyMemberScore>('BZPOPMIN', [...keys]))
    }

    zrange(key: Key, start: Integer, stop: Integer) {
        return this.send_command(new Command<MemberArray>('ZRANGE', [key, start + '', stop + '']))
    }

    zrange_withscores(key: Key, start: Integer, stop: Integer) {
        const args = [key, start + '', stop + '', 'WITHSCORES']
        return this.send_command(new Command<MemberScoreArray>('ZRANGE', args))
    }

    zrangebylex(key: Key, min: SortedSetRangeMemberOpenMin, max: SortedSetRangeMemberOpenMax, limit?: [Integer, Integer]) {
        const args = [key, min, max, ...(limit ? ['LIMIT', ...limit.map(a => a + '')] : [])]
        return this.send_command(new Command<MemberArray>('ZRANGEBYLEX', args))
    }

    zrangebyscore(key: Key, min: SortedSetRangeScoreMin, max: SortedSetRangeScoreMax, limit?: [Integer, Integer]) {
        const args = [key, min, max, ...(limit ? ['LIMIT', ...limit.map(a => a + '')] : [])]
        return this.send_command(new Command<MemberArray>('ZRANGEBYSCORE', args))
    }

    zrangebyscore_withscores(key: Key, min: SortedSetRangeScoreMin, max: SortedSetRangeScoreMax, limit?: [Integer, Integer]) {
        const args = [key, min, max, 'WITHSCORES', ...(limit ? ['LIMIT', ...limit.map(a => a + '')] : [])]
        return this.send_command(new Command<MemberScoreArray>('ZRANGEBYSCORE', args))
    }

    zrevrange(key: Key, start: Integer, stop: Integer) {
        return this.send_command(new Command<MemberArray>('ZREVRANGE', [key, start + '', stop + '']))
    }

    zrevrange_withscores(key: Key, start: Integer, stop: Integer) {
        const args = [key, start + '', stop + '', 'WITHSCORES']
        return this.send_command(new Command<MemberScoreArray>('ZREVRANGE', args))
    }

    zrevrangebylex(key: Key, min: SortedSetRangeMemberOpenMin, max: SortedSetRangeMemberOpenMax, limit?: [Integer, Integer]) {
        const args = [key, min, max, ...(limit ? ['LIMIT', ...limit.map(a => a + '')] : [])]
        return this.send_command(new Command<MemberArray>('ZREVRANGEBYLEX', args))
    }

    zrevrangebyscore(key: Key, min: SortedSetRangeScoreMin, max: SortedSetRangeScoreMax, limit?: [Integer, Integer]) {
        const args = [key, min, max, ...(limit ? ['LIMIT', ...limit.map(a => a + '')] : [])]
        return this.send_command(new Command<MemberArray>('ZREVRANGEBYSCORE', args))
    }

    zrevrangebyscore_withscores(key: Key, min: SortedSetRangeScoreMin, max: SortedSetRangeScoreMax, limit?: [Integer, Integer]) {
        const args = [key, min, max, 'WITHSCORES', ...(limit ? ['LIMIT', ...limit.map(a => a + '')] : [])]
        return this.send_command(new Command<MemberScoreArray>('ZREVRANGEBYSCORE', args))
    }

    zrank(key: Key, member: Member) {
        return this.send_command(new Command<NatureNumber | null>('ZRANK', [key, member]))
    }

    zrevrank(key: Key, member: Member) {
        return this.send_command(new Command<NatureNumber | null>('ZREVRANK', [key, member]))
    }

    zrem(key: Key, member: Member, ...members: Member[]) {
        return this.send_command(new Command<NatureNumber>('ZREM', [key, member, ...members]))
    }

    zremrangebylex(key: Key, min: SortedSetRangeMemberOpenMin, max: SortedSetRangeMemberOpenMax) {
        return this.send_command(new Command<NatureNumber>('ZREMRANGEBYLEX', [key, min, max]))
    }

    zremrangebyrank(key: Key, start: Integer, stop: Integer) {
        return this.send_command(new Command<NatureNumber>('ZREMRANGEBYRANK', [key, start + '', stop + '']))
    }

    zremrangebyscore(key: Key, min: SortedSetRangeScoreMin, max: SortedSetRangeScoreMax) {
        return this.send_command(new Command<NatureNumber>('ZREMRANGEBYSCORE', [key, min, max]))
    }

    zscore(key: Key, member: Member) {
        return this.send_command(new Command<StringDoubleValue, StringDoubleValue>('ZSCORE', [key, member]))
    }

    zinterstore(destination: Key, keys: Key[], options?: { weights?: number[], aggregate?: 'SUM' | 'MIN' | 'MAX' }) {
        const args = [destination, keys.length + '', ...keys]
        if (options?.weights) {
            args.push('WEIGHTS', ...options?.weights.map(w => w + ''))
        }
        if (options?.aggregate) {
            args.push('AGGREGATE', options?.aggregate)
        }
        return this.send_command(new Command<NatureNumber>('ZINTERSTORE', args))
    }

    zunionstore(destination: Key, keys: Key[], options?: { weights?: number[], aggregate?: 'SUM' | 'MIN' | 'MAX' }) {
        const args = [destination, keys.length + '', ...keys]
        if (options?.weights) {
            args.push('WEIGHTS', ...options?.weights.map(w => w + ''))
        }
        if (options?.aggregate) {
            args.push('AGGREGATE', options?.aggregate)
        }
        return this.send_command(new Command<NatureNumber>('ZUNIONSTORE', args))
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
