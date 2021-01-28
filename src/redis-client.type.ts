import { RedisType as R } from './lib/type'

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

    export interface HScanOptions {
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
    }

    export interface SScanOptions {
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
    }

    export namespace BitField {
        /**
         * 子命令中参数的 **offset** 都可以使用 # 修饰符，表示参照前一个参数提供的位宽，按倍数偏移。
         *
         * 如：`['GET', 'u7', '#2']` 表示偏移 2 * 7 = 14 个 bit。
         *
         * @category Parameters
         */
        export type BitFieldOffset = number | `#${number}`
        /**
         * 用以指定解析 bitfield 使用的类型，包含有符号整型和无符号整型。
         *
         * 需要注意的是，其中无符号整型最大 63 bit，有符号整型最大 64 bit。
         *
         * 如：`u16` 表示宽度 16bit 的无符号整型，`i12` 表示宽度 12bit 的有符号整型。
         *
         * @category Parameters
         */
        export type BitFieldType = `${'u' | 'i'}${number}`
        /**
         * 返回指定 bitfield。格式为 `['GET', type, offset]`。
         *
         * @category Command
         */
        export type BitFieldGet = ['GET', BitFieldType, BitFieldOffset]
        /**
         * 设置指定 bitfield。格式为 `['SET', type, offset, value]`。
         *
         * @category Command
         */
        export type BitFieldSet = ['SET', BitFieldType, BitFieldOffset, number]
        /**
         * 增加或减少指定 bitfield。格式为 `['INCRBY', type, offset, value]`。
         *
         * @category Command
         */
        export type BitFieldIncrby = ['INCRBY', BitFieldType, BitFieldOffset, number]
        /**
         * 设置溢出策略。格式为 `['OVERFLOW', OverflowStrategy]`。
         * - **WRAP 回环算法**：对于无符号整型，按照最大值进行取模操作（C语言的标准行为）。对于有符号整型，上溢从最小的负数开始取数，下溢则从最大的正数开始取数。
         * - **SAT 饱和算法**：溢出时设为溢出边界值 - 上溢出设为最大值，下溢出设为最小值。
         * - **FAIL 失败算法**：溢出时失败。
         *
         * @category Command
         */
        export type BitFieldOverflow = ['OVERFLOW', 'WRAP' | 'SAT' | 'FAIL']
        /**
         * BitField 可用的子命令联合类型。包含 {@link RedisClientParams.BitField.BitFieldGet | GET}
         * | {@link RedisClientParams.BitField.BitFieldSet | SET}
         * | {@link RedisClientParams.BitField.BitFieldIncrby | INCRBY}
         * | {@link RedisClientParams.BitField.BitFieldOverflow | OVERFLOW}
         *
         * @category CommandGroup
         */
        export type BitFieldPipelineCommand = BitFieldGet | BitFieldSet | BitFieldIncrby | BitFieldOverflow
        /**
         * @category CommandGroup
         */
        export type BitFieldPipeline = [BitFieldPipelineCommand, ...BitFieldPipelineCommand[]]
    }

    /**
     * Expires 中的三个命令是互斥的，如果存在多个，选择优先级最高的设置。
     * 优先级：[[SetOptions.keepttl | keepttl]] > [[SetOptions.expire | expire]] > [[SetOptions.pexpire | pexpire]]
     */
    export interface SetOptions {
        /**
         * - 设置以 **秒** 为单位的过期时间。
         * - 会被翻译为 EX 选项。
         * - 2.6.12 及以上版本可用。
         * - 值为 0 和值为 undefined 的行为一致。
         *
         * 查看命令接口 [[RedisClient.set | SET]]
         *
         * @category Expires
         */
        expire?: number
        /**
         * - 设置以 **毫秒** 为单位的过期时间。
         * - 会被翻译为 PX 选项。
         * - 2.6.12 及以上版本可用。
         * - 值为 0 和值为 undefined 的行为一致。
         * 查看命令接口 [[RedisClient.set | SET]]
         *
         * @category Expires
         */
        pexpire?: number
        /**
         * 会被翻译为 KEEPTTL 选项。6.0.0 及以上版本可用。
         * 查看命令接口 [[RedisClient.set | SET]]
         *
         * @category Expires
         */
        keepttl?: boolean
        /**
         * 会被翻译为 NX 或 XX 选项。2.6.12 及以上版本可用。
         * 查看命令接口 [[RedisClient.set | SET]]
         *
         * @category Exists
         */
        exist?: boolean
    }

    export interface LposOptions {
        /**
         * 从第几个匹配到的 element 开始算作返回值，默认从左侧开始匹配。
         * RANK 1 表示从第一个匹配到的开始，RANK 2 表示从第二个匹配到的开始，以此类推。
         * 当 RANK 为负数时表示 从右侧开始匹配，RANK -1 为右侧第一个元素，RANK -2 为右侧第二个元素，以此类推。
         */
        rank?: R.Integer
        /**
         * 进行对比的元素范围。
         * MAXLEN 100 表示只对比前 100 个元素。
         */
        max_len?: R.Integer
    }

    export interface ZaddOptions {
        /**
         * XX：当指定 member 存在时才执行操作。
         * NX：当指定 member 不存在时才执行操作。
         * **注意**：3.0.2 版本开始可用。
         */
        update_if_member?: 'XX' | 'NX'
        /**
         * LT：当新的 score 比旧的 score 小的时候才执行操作。
         * GT：当新的 score 比旧的 score 大的时候才执行操作。
         * **注意**：LT GT 不能和 NX 同时使用。因为不存在的值无法比较大小。
         */
        update_if_score?: 'LT' | 'GT'
        /**
         * 修改返回值行为，返回被修改的 member 个数（不设置此选项，返回新增的 member 个数）。
         * **注意**：3.0.2 版本开始可用。
         */
        return_change_count?: true
    }

    export interface ZinterOptions<T> {
        weights?: { [K in keyof T]: number }
        aggregate?: 'SUM' | 'MIN' | 'MAX'
    }

    export interface ZunionOptions<T> {
        weights?: { [K in keyof T]: number }
        aggregate?: 'SUM' | 'MIN' | 'MAX'
    }

    export type ZrangeBy = 'BYSCORE' | 'BYLEX' | 'BYRANK'

    export interface ZrangeOptions {
        reverse?: boolean
        limit?: [number, number]
    }
}

type Path<T, Key extends keyof T = keyof T> =
    Key extends string
        ? T[Key] extends Record<string, any>
        ? `${Key}.${Path<T[Key], Exclude<keyof T[Key], keyof Array<any>>> & string}` | Key
        : T[Key] extends number | string | boolean | null ? Key : never
        : never;

type PathValue<T, P extends Path<T>> =
    P extends `${infer Key}.${infer Rest}`
        ? Key extends keyof T
        ? Rest extends Path<T[Key]>
            ? PathValue<T[Key], Rest>
            : never
        : never
        : P extends keyof T
        ? T[P]
        : never;

interface Entity {
    a: number
    b: string
    c: {
        m: string
        k: number
        c: {
            m: string
            k: number
        }
    }
}

const a: PathValue<Entity, 'c.c.m'> = '3'
