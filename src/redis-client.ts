import { BaseClient } from './lib/client'
import { Command, CommandOptions } from './lib/command'
import { CommandInfo, RedisClientOptions, RedisType as R } from './lib/type'
import { RedisUtils } from './lib/utils'

export namespace RedisClientParams {
    export interface MigrateOptions {
        /**
         * 是否添加 COPY 选项，默认不添加
         * - 3.0.0 开始支持 COPY 选项。
         */
        copy?: boolean
        /**
         * 是否添加 REPLACE 选项，默认不添加。
         */
        replace?: boolean
        /**
         * 是否添加 AUTH 选项，默认不添加。
         * - 4.0.7 开始支持 auth password 选项。
         * - 6.0.0 开始支持使用 username 选项。
         */
        auth?: {
            username?: string
            password: string
        }
    }

    export interface RestoreOptions {
        /**
         * 是否添加 REPLACE 标记。
         */
        replace?: boolean
        /**
         * 是否添加 ABSTTL 标记，使用 absolute unix timestamp 方式设置 ttl。
         * - 5.0.0 及以上版本可用。
         */
        absttl?: boolean
        /**
         * 驱逐策略，参见 {@link RedisClient.object | OBJECT} 查看更多信息。
         * - 5.0.0 及以上版本可用。
         */
        idletime?: number
        /**
         * 驱逐策略，参见 {@link RedisClient.object | OBJECT} 查看更多信息。
         * - 5.0.0 及以上版本可用。
         */
        freq?: number
    }

    export interface SortOptions {
        /**
         * 需要依赖外部的 key 进行排序时，提供此参数。
         * - 当 pattern 匹配不到任何 key 时，Redis 认为查询到的值为 0。
         * - 当查询到的值相同时，Redis 会按照原始值降序排列（无论是否设置 ASC | DESC 标记），会受到 ALPHA 标记影响。
         *
         * 如：
         * ```
         * > LPUSH gid 1 2 3 4 // 4
         * > SET price_1 4  // OK
         * > SET price_2 1  // OK
         * > SET price_3 3  // OK
         * > SET price_4 2  // OK
         * > SORT mylist
         * > "1"
         * > "2"
         * > "3"
         * > "4"
         * > SORT mylist by price_*
         * > "2"
         * > "4"
         * > "3"
         * > "1"
         * ```
         */
        by?: R.KeyPattern
        /**
         * 可以使用此参数进行限制返回值数量。
         * 格式为 offset count
         *
         * 如 `{ limit: [5, 10], ... }` 表示返回跳过 5 个元素之后的 10 个元素。
         */
        limit?: [number, number]
        /**
         * 是否按照字典序进行排序。
         * 当正确设置了 !LC_COLLATE 环境变量时，Redis 可以识别 UTF-8 编码。
         */
        alpha?: boolean
        /**
         * 是否需要倒序，默认排序方向为正序（从小到大）。
         */
        desc?: boolean
        /**
         * 需要取出的值的 pattern 列表，可以使用 # 表示排序值本身。
         *
         * 如 `{ by: 'score_*', get: ['#', 'name_*', 'score_*'] }` 将被解析为如下命令：
         *
         * ```
         * 127.0.0.1:6379> SORT student BY score_* GET # GET name_* GET score_*
         * > "10000010"      // 这是 student
         * > "张三"          // 这是 name
         * > "91"            // 这是 score，以下类推
         * > "10000030"
         * > "李四"
         * > "94"
         * > "10000040"
         * > "王五"
         * > "92"
         * > "10000020"
         * > "赵六"
         * > "93"
         * ```
         */
        get?: string[]
    }

    export interface ScanOptions {
        /**
         * 迭代将返回匹配 pattern 的 key。
         * 但是因为匹配是发生在取出 key 之后，返回数据之前。所以如果匹配 pattern 的元素很少，可能会导致多次返回的集合都是空的。
         */
        match?: R.KeyPattern
        /**
         * 控制每次迭代返回的 key 数量。
         * 对于增量式迭代命令不保证每次迭代所返回的元素数量，count 可以用于对返回数量进行一定程度的调整。
         * - COUNT 参数的默认值为 10。
         * - 数据集比较大时，如果没有使用 MATCH 选项, 那么命令返回的元素数量通常和 COUNT 选项指定的一样，或者比 COUNT 选项指定的数量稍多一些。
         * - 在迭代一个编码为整数集合（intset，一个只由整数值构成的小集合）、 或者编码为压缩列表（ziplist，由不同值构成的一个小哈希或者一个小有序集合）时，增量式迭代命令通常会无视 COUNT 选项指定的值， 在第一次迭代就将数据集包含的所有元素都返回给用户。
         */
        count?: number
        /**
         * 6.0.0 及以上版本，你可以使用这个选项过滤返回元素的类型。
         * 和 match 一样，匹配是发生在取出 key 之后，返回数据之前。
         *
         * 需要注意的是，像 GeoHashes HyperLogLogs Bitmaps 和 Bitfields 这些Redis 类型，可能是通过其他数据结构来实现的。这会导致不能区分一些类型。
         *
         * 比如：ZSET 和 GEOHASH。
         */
        type?: R.RedisValueType
    }
}

export class RedisClient extends BaseClient {

    constructor(options: RedisClientOptions) {
        super(options)
    }

    // Generic 25

    /**
     * > - **起始版本：**6.2.0
     * > - **时间复杂度：**对于 string 类型是 O(1), 对于集合类型的值为 O(N), N 为嵌套元素个数。
     *
     * 将 source key 的值复制到 destination key。
     *
     * @category Generic
     * @param source
     * @param destination
     * @return
     *
     * *[查看原始定义](https://redis.io/commands/copy)*
     */
    copy(source: R.Key, destination: R.Key): Promise<0 | 1>
    /**
     * > - **起始版本：**6.2.0
     * > - **时间复杂度：**对于 string 类型是 O(1), 对于集合类型的值为 O(N), N 为嵌套元素个数。
     *
     * 将 source key 的值复制到 destination key。
     *
     * @param source
     * @param destination
     * @param db destination key 如果不在当前 db，则需要提供新的 db 号。
     * @return
     *
     * *[查看原始定义](https://redis.io/commands/copy)*
     */
    copy(source: R.Key, destination: R.Key, db: R.Db): Promise<0 | 1>
    /**
     * > - **起始版本：**6.2.0
     * > - **时间复杂度：**对于 string 类型是 O(1), 对于集合类型的值为 O(N), N 为嵌套元素个数。
     *
     * 将 source key 的值复制到 destination key。
     *
     * @param source
     * @param destination
     * @param replace 是否添加 REPLACE 标签。
     * @return
     *
     * *[查看原始定义](https://redis.io/commands/copy)*
     */
    copy(source: R.Key, destination: R.Key, replace: boolean): Promise<0 | 1>
    /**
     * > - **起始版本：**6.2.0
     * > - **时间复杂度：**对于 string 类型是 O(1), 对于集合类型的值为 O(N), N 为嵌套元素个数。
     *
     * 将 source key 的值复制到 destination key。
     *
     * @param source
     * @param destination
     * @param db destination key 如果不在当前 db，则需要提供新的 db 号。
     * @param replace 是否添加 REPLACE 标签。
     * @return
     *
     * *[查看原始定义](https://redis.io/commands/copy)*
     */
    copy(source: R.Key, destination: R.Key, db: R.Db, replace: boolean): Promise<0 | 1>
    copy(source: R.Key, destination: R.Key, db?: R.Db | boolean, replace?: boolean) {
        const args = [source, destination]
        if (typeof db === 'number') {
            args.push(db + '')
        }
        if (typeof db === 'boolean' || replace) {
            args.push('REPLACE')
        }
        return this.send_command(new Command<0 | 1>('COPY', args))
    }

    /**
     * > - **起始版本：**1.0.0
     * > - **时间复杂度：**O(N)，N 为需要删除的 key 的个数。
     *
     * 从数据库中删除指定的 key。
     *
     * @category Generic
     * @param keys 需要删除的 key 列表。
     * @return
     *
     * *[查看原始定义](https://redis.io/commands/del)*
     */
    del(...keys: [R.Key, ...R.Key[]]) {
        return this.send_command(new Command<R.KeyCount>('DEL', [...keys]))
    }

    /**
     * > - **起始版本：**2.6.0
     * > - **时间复杂度：**访问 key 为 O(1), 之后需要额外的 O(N * M) 进行序列化。N 为 组成该值的 Redis 对象数量，M 为他们的平均大小。对于小的 string 类型的值，时间复杂度为 O(1) + O(1 * M)，而 M 又很小，可以简化为 O(1)。
     *
     * 序列化导出 key 处的值。当 key 不存在返回 null。
     *
     * 可以使用 {@link RedisClient.restore | RESTORE} 命令可以进行反序列化并存储。
     *
     * **Redis 序列化特点**：
     * - 带有 64 位校验和，用于检测错误。 {@link RedisClient.restore | RESTORE} 反序列化之前会先进行校验。
     * - 值的编码格式和 RDB 保持一致。
     * - RDB 版本会被编码在序列化值当中，如果因为 Redis 的版本不同造成 RDB 格式不兼容，那么 Redis 会拒绝对这个值进行反序列化。
     *
     * 序列化的值不包含任何 TTL 信息。
     *
     * @category Generic
     * @param key
     * @return
     *
     * *[查看原始定义](https://redis.io/commands/dump)*
     */
    dump(key: R.Key) {
        return this.send_command(new Command<R.KeyCount>('DUMP', [key]))
    }

    /**
     * > - **起始版本：**1.0.0
     * > - **时间复杂度：**O(1)
     *
     * 返回 key 是否存在。
     *
     * 返回值含义：
     * - `1`：当 key 存在。
     * - `0`：当 key 不存在。
     *
     * **3.0.3** 版本开始可以传递多个 key。此时会返回存在的 key 的个数。
     *
     * @category Generic
     * @param keys 需要检查的 key。**3.0.3** 版本开始支持传递多个 key。
     * @return
     *
     * *[查看原始定义](https://redis.io/commands/exists)*
     */
    exists(...keys: [R.Key, ...R.Key[]]) {
        return this.send_command(new Command<R.KeyCount>('EXISTS', [...keys]))
    }

    /**
     * > - **起始版本：**1.0.0
     * > - **时间复杂度：**O(1)
     *
     * 设置 key 的超时时间，到期后 key 会自动删除。
     *
     * 当删除或重写 key 的时候，例如 {@link RedisClient.del | DEL}，
     * {@link RedisClient.set | SET}，{@link RedisClient.getset | GETSET} 和所有 *STORE 命令，
     * 超时时间设置会被清除。
     * 其他的诸如 {@link RedisClient.incr | INCR}，{@link RedisClient.lpush | LPUSH} 等概念上修改了 key 的操作，不会影响超时时间。
     *
     * 返回值含义：
     * - `1`：ttl 设置成功。
     * - `0`：key 不存在，设置失败。
     *
     * @category Generic
     * @param key
     * @param ttl 需要设置的超时时间。
     * @return
     *
     * *[查看原始定义](https://redis.io/commands/expire)*
     */
    expire(key: R.Key, ttl: R.TTL) {
        return this.send_command(new Command<0 | 1>('EXPIRE', [key, ttl + '']))
    }

    /**
     * > - **起始版本：**1.2.0
     * > - **时间复杂度：**O(1)
     *
     * 效果和 {@link RedisClient.expire | EXPIRE} 一样，区别是 EXPIREAT 的参数是到期的 Timestamp。
     *
     * 返回值含义：
     * - `1`：ttl 设置成功。
     * - `0`：key 不存在，设置失败。
     *
     * @category Generic
     * @param key
     * @param timestamp 需要设置的过期时间戳。
     * @return
     *
     * *[查看原始定义](https://redis.io/commands/expireat)*
     */
    expireat(key: R.Key, timestamp: R.Timestamp) {
        return this.send_command(new Command<0 | 1>('EXPIREAT', [key, timestamp + '']))
    }

    /**
     * > - **起始版本：**1.0.0
     * > - **时间复杂度：**O(N)，N 为当前库中 key 的个数。
     *
     * 返回匹配 pattern 的全部 key 的列表。
     *
     * **警告：** 这是一个方便调试的命令，当你对一个庞大的库使用这个命令时，会导致性能及其底下。
     *
     * 支持的 glob 风格 patterns:
     * - `h?llo` 匹配 `hello`, `hallo` 和 `hxllo`。
     * - `h*llo` 匹配 `hllo` 和 `heeeello`。
     * - `h[ae]llo` 匹配 `hello`，`hallo`，但是 `hillo` 不行。
     * - `h[^e]llo` 匹配 `hallo`， `hbllo`，但是 `hello` 不行。
     * - `h[a-b]llo` 匹配 `hallo` 和 `hbllo`。
     *
     * @category Generic
     * @param pattern glob 风格匹配模式。
     * @return
     *
     * *[查看原始定义](https://redis.io/commands/keys)*
     */
    keys(pattern: R.KeyPattern) {
        return this.send_command(new Command<R.Key[]>('KEYS', [pattern]))
    }

    /**
     * > - **起始版本：**2.6.0
     * > - **时间复杂度：**该命令实际上在源实例中执行了{@link RedisClient.dump | DUMP} + {@link RedisClient.del | DEL}，而在目标实例中执行{@link RedisClient.restore | RESTORE}。这部分的时间复杂度，请参见这些命令的页面。在两个实例之间数据传输的复杂度为O(N)。
     *
     * 将 key 原子性的传输到目标 Redis 实例。
     *
     * 成功时返回 OK,  找不到 key 返回 NOKEY。
     * 当执行多个 key 时，只要有至少一个可以执行 migrate 的 key，即返回 OK。否则如果源数据中找不到任何返回 NOKEY。
     *
     * @category Generic
     * @param host 目标实例地址。
     * @param port 目标实例端口号。
     * @param keys 需要传输的 key 列表，在 3.0.6 以上的版本可以支持多个 key 传输。
     * @param destination_db 目标实例的数据库。
     * @param timeout 超时时间，单位毫秒。
     * @param options 选项
     * @return
     *
     * *[查看原始定义](https://redis.io/commands/migrate)*
     */
    migrate(host: string, port: number, keys: [R.Key, ...R.Key[]], destination_db: number, timeout: number, options?: RedisClientParams.MigrateOptions) {
        const key = keys.length > 1 ? '' : keys[0]
        const args = [host, port + '', key, destination_db + '', timeout + '']
        if (options?.copy) {
            args.push('COPY')
        }
        if (options?.replace) {
            args.push('REPLACE')
        }
        if (options?.auth) {
            if (options.auth.username) {
                args.push('AUTH2', options.auth.username, options.auth.password)
            } else {
                args.push('AUTH', options.auth.password)
            }
        }
        if (key === '') {
            args.push('KEYS', ...keys)
        }
        return this.send_command(new Command<'OK' | 'NOKEY'>('MIGRATE', args))
    }

    /**
     * > - **起始版本：**2.6.0
     * > - **时间复杂度：**O(1)
     *
     * 将密钥从当前选定的数据库（请参见{@link RedisClient.select | SELECT}）移动到指定的目标数据库。
     *
     * 如果目标数据库中已经存在密钥，或者源数据库中不存在密钥，则它什么都不做。 因此，可以将 MOVE 用作锁定原语。
     *
     * 返回值含义：
     * - `1` key 移动成功。
     * - `0` key 没有移动。
     *
     * @category Generic
     * @param key
     * @param db
     * @return
     *
     * *[查看原始定义](https://redis.io/commands/move)*
     */
    move(key: R.Key, db: number) {
        return this.send_command(new Command<R.Bit>('MOVE', [key, db + '']))
    }

    /**
     * > - **起始版本：**2.2.3
     * > - **时间复杂度：**O(1)。
     *
     * **调试命令：**返回与指定 key 关联的值的引用计数。
     *
     * @category Generic
     * @param subcommand
     * @param key
     * @return
     *
     * *[查看原始定义](https://redis.io/commands/object)*
     */
    object(subcommand: 'REFCOUNT', key: R.Key): Promise<number | null>
    /**
     * > - **起始版本：**2.2.3
     * > - **时间复杂度：**O(1)。
     *
     * 返回用于存储与键关联的值的内部表示形式的类型。
     *
     * - **string** 可以编码为 raw（常规字符串编码），embstr （专门用于保存短字符串）或 int（以64位有符号间隔表示整数的字符串以这种方式编码，以节省空间）。
     * - **list** 可以编码为 ziplist 或 linkedlist。ziplist是一种特殊的表示形式，用于节省小 **list** 的空间。
     * - **set** 可以编码为 intset 或 hashtable。intset 是一种特殊的编码，用于仅由整数组成的小 **set**。
     * - **hash** 可以编码为 ziplist 或 hashtable。ziplist 是用于小 **hash** 的特殊编码。
     * - **zset** 可以编码为 ziplist 或 skiplist 格式。ziplist 适用于小的 **list** 和 **zset**，skiplist 编码则适用于任何大小的 **zset**。
     *
     * @param subcommand
     * @param key
     * @return
     *
     * *[查看原始定义](https://redis.io/commands/object)*
     */
    object(subcommand: 'ENCODING', key: R.Key): Promise<R.RedisValueEncoding | null>
    /**
     * > - **起始版本：**2.2.3
     * > - **时间复杂度：**O(1)。
     *
     * 返回指定 key 处的对象自存储以来处于空闲状态的秒数（读或写操作未请求）。
     * 虽然以秒为单位返回该值，但此计时器的实际分辨率为 10 秒，这在将来的实现中可能会有所不同。
     * 当 maxmemory-policy 设置为 LRU 策略或 noeviction 并且设置了 maxmemory 时，此子命令可用。
     *
     * @param subcommand
     * @param key
     * @return
     *
     * *[查看原始定义](https://redis.io/commands/object)*
     */
    object(subcommand: 'IDLETIME', key: R.Key): Promise<number | null>
    /**
     * > - **起始版本：**2.2.3
     * > - **时间复杂度：**O(1)。
     *
     * 返回存储在指定键处的对象的对数访问频率计数器。
     * 当 maxmemory-policy 设置为 LFU 策略时，此子命令可用。
     *
     * @param subcommand
     * @param key
     * @return
     *
     * *[查看原始定义](https://redis.io/commands/object)*
     */
    object(subcommand: 'FREQ', key: R.Key): Promise<number | null>
    /**
     * > - **起始版本：**2.2.3
     * > - **时间复杂度：**O(1)。
     *
     * 返回 OBJECT 命令的一个简洁说明。
     *
     * @param subcommand
     * @return
     *
     * *[查看原始定义](https://redis.io/commands/object)*
     */
    object(subcommand: 'HELP'): Promise<string>
    object(subcommand: 'REFCOUNT' | 'ENCODING' | 'IDLETIME' | 'FREQ' | 'HELP', key?: R.Key) {
        const args: string[] = [subcommand]
        if (key) {
            args.push(key)
        }
        return this.send_command(new Command<number | string | null>('OBJECT', args))
    }

    /**
     * > - **起始版本：**2.2.0
     * > - **时间复杂度：**O(1)。
     *
     * 清除 ttl。
     *
     * 返回值含义：
     * - `1` 成功清除 ttl。
     * - `0` 当 key 不存在或存在但未设置 ttl。
     *
     * @category Generic
     * @param key
     * @return
     *
     * *[查看原始定义](https://redis.io/commands/persist)*
     */
    persist(key: R.Key) {
        return this.send_command(new Command<0 | 1>('PERSIST', [key]))
    }

    /**
     * > - **起始版本：**2.6.0
     * > - **时间复杂度：**O(1)
     *
     * 效果和 {@link RedisClient.expire | EXPIRE} 一样，区别是 PEXPIRE 的 ttl 是毫秒单位。
     *
     * 返回值含义：
     * - `1` ttl 设置成功。
     * - `0` key 不存在，设置失败。
     *
     * @category Generic
     * @param key
     * @param ttl 需要设置的超时时间，单位毫秒。
     * @return
     *
     * *[查看原始定义](https://redis.io/commands/pexpire)*
     */
    pexpire(key: R.Key, ttl: R.PTTL) {
        return this.send_command(new Command<R.Bit>('PEXPIRE', [key, ttl + '']))
    }

    /**
     * > - **起始版本：**2.6.0
     * > - **时间复杂度：**O(1)
     *
     * 效果和 {@link RedisClient.expireat | EXPIREAT} 一样，区别是 PEXPIREAT 的到期时间戳是毫秒级的。
     *
     * 返回值含义：
     * - `1` ttl 设置成功。
     * - `0` key 不存在，设置失败。
     *
     * @category Generic
     * @param key
     * @param timestamp 需要设置的过期时间戳，单位毫秒。
     * @return
     *
     * *[查看原始定义](https://redis.io/commands/pexpireat)*
     */
    pexpireat(key: R.Key, timestamp: R.MilliTimestamp) {
        return this.send_command(new Command<R.Bit>('PEXPIREAT', [key, timestamp + '']))
    }

    /**
     * > - **起始版本：**2.6.0
     * > - **时间复杂度：**O(1)
     *
     * 返回查询的值的剩余有效毫秒数。
     * - 如果 key 不存在，2.8 及之后的版本返回 -2， 更早的版本返回 -1。
     * - 如果 key 存在且未设置 ttl 则返回 -1。
     *
     * @category Generic
     * @param key
     * @return
     *
     * *[查看原始定义](https://redis.io/commands/pttl)*
     */
    pttl(key: R.Key) {
        return this.send_command(new Command<R.PTTL>('PTTL', [key]))
    }

    /**
     * > - **起始版本：**1.0.0
     * > - **时间复杂度：**O(1)
     *
     * 随机返回一个当前 db 的 key。当数据库为空时返回 null。
     *
     * @category Generic
     * @return
     *
     * *[查看原始定义](https://redis.io/commands/randomkey)*
     */
    randomkey() {
        return this.send_command(new Command<R.Key | null>('RANDOMKEY', []))
    }

    /**
     * > - **起始版本：**1.0.0
     * > - **时间复杂度：**O(1)
     *
     * 重命名 key 到 newkey。当 key 不存在时抛出异常。如果 newkey 已经存在，则会对其进行重写。
     * 由于 RENAME 的执行包含隐式的 {@link RedisClient.del | DEL} 操作。所以尽管 RENAME 的耗时通常是常量的，但如果需要删除的值很大，也会引起很高的延迟。
     * - 3.2.0 及更早的版本中，如果 key 和 newkey 相同，会抛出异常。
     *
     * @category Generic
     * @param key
     * @param newkey
     * @return
     *
     * *[查看原始定义](https://redis.io/commands/rename)*
     */
    rename(key: R.Key, newkey: R.Key) {
        return this.send_command(new Command<'OK'>('RENAME', [key, newkey]))
    }

    /**
     * > - **起始版本：**1.0.0
     * > - **时间复杂度：**O(1)
     *
     * 当 newkey 不存在时重命名 key 到 newkey。当 key 不存在时抛出异常。
     * - 3.2.0 及更早的版本中，如果 key 和 newkey 相同，会抛出异常。
     *
     * 返回值含义：
     * - `1` 如果 key 重命名到 newkey。
     * - `0` 如果 newkey 已经存在。
     *
     * @category Generic
     * @param key
     * @param newkey
     * @return
     *
     * *[查看原始定义](https://redis.io/commands/renamenx)*
     */
    renamenx(key: R.Key, newkey: R.Key) {
        return this.send_command(new Command<0 | 1>('RENAMENX', [key, newkey]))
    }

    /**
     * > - **起始版本：**2.6.0
     * > - **时间复杂度：**O(1) 创建新 key，O(N * M)进行反序列化，其中 N 是组成该值的 Redis 对象的数量，M 是其平均大小。
     * 对于较小的 string 值，时间复杂度为O(1) + O(1 * M)，其中 M 很小，可以简单地认为复杂度为 O(1)。
     * 对于 zset，复杂度为 O(N * M * log(N))，因为将值插入排序的集合中的复杂度为 O(log(N))。
     *
     * 通过反序列化 {@link RedisClient.dump | DUMP} 得到的值，在 key 处创建新值。
     * 反序列化时会检查 RDB 文件版本及校验和，如果不匹配则会抛出异常。
     *
     * 如果 ttl 设置为 0，表示不设置 ttl。
     *
     * 在 3.0.0 及以上版本，如果 key 已经存在，且没有设置 replace 标记，会抛出 Target key name is busy 异常。
     *
     * @category Generic
     * @param key
     * @param ttl
     * @param serialized_value
     * @param options
     * @return
     *
     * *[查看原始定义](https://redis.io/commands/renamenx)*
     */
    restore(key: R.Key, ttl: R.TTL, serialized_value: string, options?: RedisClientParams.RestoreOptions) {
        const args = [key, ttl + '', serialized_value]
        if (options?.replace) {
            args.push('REPLACE')
        }
        if (options?.absttl) {
            args.push('ABSTTL')
        }
        if (options?.idletime !== undefined) {
            args.push('IDLETIME', options.idletime + '')
        }
        if (options?.freq !== undefined) {
            args.push('FREQ', options.freq + '')
        }
        return this.send_command(new Command<0 | 1>('RESTORE', args))
    }

    /**
     * > - **起始版本：**1.0.0
     * > - **时间复杂度：**O(N + M * log(M)) 其中 N 是要排序的元素的数量，M 是返回的元素的数量。
     * 如果不对元素进行排序，则当前的复杂度为 O(N)，在下一版本中将避免复制步骤。
     *
     * key 对应的值类型必须是 list set zset 中的一种，否则会抛出操作类型错误的异常。
     *
     * 默认情况下，排序是基于数字的，各个元素将会被转化成双精度浮点数来进行大小比较，这是 SORT 命令最简单的形式。
     *
     * 需要排序的 key 不存在时，返回空数组。
     *
     * @category Generic
     * @param key
     * @return
     *
     * *[查看原始定义](https://redis.io/commands/sort)*
     */
    sort(key: R.Key): Promise<string[]>
    /**
     * > - **起始版本：**1.0.0
     * > - **时间复杂度：**O(N + M * log(M)) 其中 N 是要排序的元素的数量，M 是返回的元素的数量。
     * 如果不对元素进行排序，则当前的复杂度为 O(N)，在下一版本中将避免复制步骤。
     *
     * key 对应的值类型必须是 list set zset 中的一种，否则会抛出操作类型错误的异常。
     *
     * 默认情况下，排序是基于数字的，各个元素将会被转化成双精度浮点数来进行大小比较，这是 SORT 命令最简单的形式。
     *
     * 需要排序的 key 不存在时，返回空数组。
     *
     * @param key
     * @param store 指定 key 用来存储排序结果。当指定的 key 已经存在时，会被覆盖。
     * @return
     *
     * *[查看原始定义](https://redis.io/commands/sort)*
     */
    sort(key: R.Key, store: R.Key): Promise<string[]>
    /**
     * > - **起始版本：**1.0.0
     * > - **时间复杂度：**O(N + M * log(M)) 其中 N 是要排序的元素的数量，M 是返回的元素的数量。
     * 如果不对元素进行排序，则当前的复杂度为 O(N)，在下一版本中将避免复制步骤。
     *
     * key 对应的值类型必须是 list set zset 中的一种，否则会抛出操作类型错误的异常。
     *
     * 默认情况下，排序是基于数字的，各个元素将会被转化成双精度浮点数来进行大小比较，这是 SORT 命令最简单的形式。
     *
     * 需要排序的 key 不存在时，返回空数组。
     *
     * @param key
     * @param options
     * @return
     *
     * *[查看原始定义](https://redis.io/commands/sort)*
     */
    sort(key: R.Key, options: RedisClientParams.SortOptions): Promise<string[]>
    /**
     * > - **起始版本：**1.0.0
     * > - **时间复杂度：**O(N + M * log(M)) 其中 N 是要排序的元素的数量，M 是返回的元素的数量。
     * 如果不对元素进行排序，则当前的复杂度为 O(N)，在下一版本中将避免复制步骤。
     *
     * key 对应的值类型必须是 list set zset 中的一种，否则会抛出操作类型错误的异常。
     *
     * 默认情况下，排序是基于数字的，各个元素将会被转化成双精度浮点数来进行大小比较，这是 SORT 命令最简单的形式。
     *
     * 需要排序的 key 不存在时，返回空数组。
     *
     * @param key
     * @param store 指定 key 用来存储排序结果。当指定的 key 已经存在时，会被覆盖。
     * @param options
     * @return
     *
     * *[查看原始定义](https://redis.io/commands/sort)*
     */
    sort(key: R.Key, store: R.Key, options: RedisClientParams.SortOptions): Promise<string[]>
    sort(key: R.Key, store?: R.Key | RedisClientParams.SortOptions, options?: RedisClientParams.SortOptions) {
        const args = [key]
        if (typeof store !== 'string') {
            options = store
            store = undefined
        }
        if (options?.by) {
            args.push('BY', options.by)
        }
        if (options?.limit) {
            args.push('LIMIT', options.limit[0] + '', options.limit[1] + '')
        }
        if (options?.get) {
            options?.get.forEach(pattern => args.push('GET', pattern))
        }
        if (options?.desc) {
            args.push('DESC')
        }
        if (options?.alpha) {
            args.push('ALPHA')
        }
        if (store) {
            args.push('STORE', store)
        }
        return this.send_command(new Command<string[]>('SORT', args))
    }

    /**
     * > - **起始版本：**3.2.1
     * > - **时间复杂度：**O(N) 其中 N 是将 key 的数量。
     *
     * 此命令会修改 key 的最后访问时间。返回存在的 key 的个数。
     *
     * @category Generic
     * @param keys
     * @return
     *
     * *[查看原始定义](https://redis.io/commands/touch)*
     */
    touch(...keys: [R.Key, ...R.Key[]]) {
        return this.send_command(new Command<string[]>('TOUCH', keys))
    }

    /**
     * > - **起始版本：**2.6.0
     * > - **时间复杂度：**O(1)
     *
     * 返回查询的值的剩余有效毫秒数。
     * - 如果 key 不存在，2.8 及之后的版本返回 -2， 更早的版本返回 -1。
     * - 如果 key 存在且未设置 ttl 则返回 -1。
     *
     * @category Generic
     * @param key
     * @return
     *
     * *[查看原始定义](https://redis.io/commands/ttl)*
     */
    ttl(key: R.Key) {
        return this.send_command(new Command<R.TTL>('TTL', [key]))
    }

    /**
     * > - **起始版本：**1.0.0
     * > - **时间复杂度：**O(1)
     *
     * 返回指定 key 对应的值类型，可能是其中一个 string, list, set, zset, hash, stream。
     *
     * 当 key 不存在时 返回字符串 none。
     *
     * @category Generic
     * @param key
     * @return
     *
     * *[查看原始定义](https://redis.io/commands/type)*
     */
    type(key: R.Key) {
        return this.send_command(new Command<R.RedisValueType | 'none'>('TYPE', [key]))
    }

    /**
     * > - **起始版本：**4.0.0
     * > - **时间复杂度：**删除每个键的复杂度为 O(1) 和值大小无关。在之后的回收内存操作的复杂度为 O(N)，N 为组成待回收对象的分配空间大小。
     *
     * 此命令和 {@link RedisClient.del | DEL} 作用相似，删除指定的 key(s)，不存在则被跳过。区别是 UNLINK 只会同步的从 keyspace 中删除 key，回收内存的工作是在另外的线程中异步执行的。
     * 所以性能会比 {@link RedisClient.del | DEL} 好一些。
     *
     * @category Generic
     * @param keys
     * @return
     *
     * *[查看原始定义](https://redis.io/commands/unlink)*
     */
    unlink(...keys: [R.Key, ...R.Key[]]) {
        return this.send_command(new Command<R.KeyCount>('UNLINK', keys))
    }

    /**
     * > - **起始版本：**3.0.0
     * > - **时间复杂度：**O(1)
     *
     * TODO: 补命令说明。
     *
     * @category Generic
     * @param numreplicas
     * @param timeout 单位毫秒
     * @return
     *
     * *[查看原始定义](https://redis.io/commands/wait)*
     */
    wait(numreplicas: number, timeout: number) {
        return this.send_command(new Command<R.KeyCount>('WAIT', [numreplicas + '', timeout + '']))
    }

    /**
     * > - **起始版本：**2.8.0
     * > - **时间复杂度：**每次调用的消耗为O(1)，完整迭代一次为 O(N)，包括足以使光标返回到 0 的命令调用。N 是集合内元素的数量。
     *
     * 此命令用于增量迭代一个集合元素。
     *
     * 由于此命令为增量迭代方式，中途可能有元素被修改，所以无法保证完全的准确性。
     *
     * @category Generic
     * @param cursor
     * @param options
     * @return
     *
     * *[查看原始定义](https://redis.io/commands/wait)*
     */
    scan(cursor: number, options?: RedisClientParams.ScanOptions) {
        const args = [cursor + '']
        if (options?.match) {
            args.push('MATCH', options.match)
        }
        if (options?.count) {
            args.push('COUNT', options.count + '')
        }
        if (options?.type) {
            args.push('TYPE', options.type)
        }
        return this.send_command(new Command<R.KeyCount>('SCAN', args))
    }

    // Server 1

    /**
     * ```
     * 起始版本：1.0.0
     * 时间复杂度：O(N)，N 为当前库中 key 的个数。
     * ```
     *
     * 清空当前数据库的全部 key。
     *
     * @category Server
     * @param async 是否异步执行， 4.0.0 开始支持。
     * @return
     *
     * *[查看原始定义](https://redis.io/commands/flushdb)*
     */
    flushdb(async?: boolean) {
        const args = async ? ['ASYNC'] : []
        return this.send_command(new Command<'OK'>('FLUSHDB', args))
    }

    // string

    /**
     * ```
     * 起始版本：2.0.0
     * 时间复杂度：分摊时间复杂度为 O(1)。
     * ```
     *
     * 如果已经存在并且值类型为 string，此命令会追加 value 到值的结尾。如果 key 不存在，则先创建为空字符串。
     * 其他情况会抛出异常。
     *
     * 返回追加后的字符串长度。
     *
     * @category Strings
     * @param key
     * @param value 需要追加的内容。
     * @return
     *
     * *[查看原始定义](https://redis.io/commands/append)*
     */
    append(key: R.Key, value: R.StringValue) {
        return this.send_command(new Command<R.KeyCount>('APPEND', [key, value]))
    }

    /**
     * ```
     * 起始版本：1.0.0
     * 时间复杂度：O(1)
     * ```
     *
     * 获取 key 对应的值。
     *
     * 如果 key 不存在返回 null。
     *
     * 如果 key 的值类型不是 string 抛出异常。
     *
     * @category Strings
     * @param key
     * @param options 控制返回值的处理方式。
     * @return
     *
     * *[查看原始定义](https://redis.io/commands/get)*
     */
    get(key: R.Key, options?: CommandOptions) {
        return this.send_command(new Command<R.StringValue | null>('GET', [key], options))
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
        return this.send_command(new Command<any[], { [key: string]: CommandInfo }>('COMMAND', [], undefined, data => RedisUtils.parse_command_info(data)))
    }

    command_info(command: string, ...commands: string[]) {
        return this.send_command(new Command<any[], { [key: string]: CommandInfo }>('COMMAND', ['INFO', command, ...commands], undefined, data => RedisUtils.parse_command_info(data)))
    }

    command_count() {
        return this.send_command(new Command<number, number>('COMMAND', ['COUNT']))
    }

    // command_getkeys() {
    //     return this.send_command(new Command<string[], string[]>('COMMAND', ['GETKEYS']))
    // }
}
