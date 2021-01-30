import { ReplyError } from './redis-errors'

export type REDIS_INFO_SECTION =
    | 'server'
    | 'clients'
    | 'memory'
    | 'persistence'
    | 'stats'
    | 'replication'
    | 'cpu'
    | 'commandstats'
    | 'cluster'
    | 'keyspace'
    | 'all'
    | 'defaultƒ'

export interface RedisServerInfo {
    // Server
    redis_version?: string                              // 999.999.999
    redis_git_sha1?: string                             // ceaf58df
    redis_git_dirty?: string                            // 1
    redis_build_id?: string                             // a5eeeb464ee54856
    redis_mode?: string                                 // standalone
    os?: string                                         // Linux 4.1.5-x86_64-linode61 x86_64
    arch_bits?: string                                  // 32
    multiplexing_api?: string                           // epoll
    gcc_version?: string                                // 4.4.1
    process_id?: string                                 // 21798
    run_id?: string                                     // 2569bb7433bfe013c2627edf62d9bf21eaf8a010
    tcp_port?: string                                   // 6379
    uptime_in_seconds?: string                          // 3348607
    uptime_in_days?: string                             // 38
    hz?: string                                         // 10
    lru_clock?: string                                  // 491100
    config_file?: string                                // /etc/redis/6379.conf

    // Clients
    connected_clients?: string                          // 8
    client_longest_output_list?: string                 // 0
    client_biggest_input_buf?: string                   // 0
    blocked_clients?: string                            // 0

    // Memory
    used_memory?: string                                // 7556576
    used_memory_human?: string                          // 7.21M
    used_memory_rss?: string                            // 10555392
    used_memory_rss_human?: string                      // 10.07M
    used_memory_peak?: string                           // 8370272
    used_memory_peak_human?: string                     // 7.98M
    total_system_memory?: string                        // 4142215168
    total_system_memory_human?: string                  // 3.86G
    used_memory_lua?: string                            // 24576
    used_memory_lua_human?: string                      // 24.00K
    maxmemory?: string                                  // 3221225472
    maxmemory_human?: string                            // 3.00G
    maxmemory_policy?: string                           // unknown
    mem_fragmentation_ratio?: string                    // 1.40
    mem_allocator?: string                              // jemalloc-3.6.0
    lazyfree_pending_objects?: string                   // 0

    // Persistence
    loading?: string                                    // 0
    rdb_changes_since_last_save?: string                // 521
    rdb_bgsave_in_progress?: string                     // 0
    rdb_last_save_time?: string                         // 1460108780
    rdb_last_bgsave_status?: string                     // ok
    rdb_last_bgsave_time_sec?: string                   // 0
    rdb_current_bgsave_time_sec?: string                // -1
    aof_enabled?: string                                // 0
    aof_rewrite_in_progress?: string                    // 0
    aof_rewrite_scheduled?: string                      // 0
    aof_last_rewrite_time_sec?: string                  // -1
    aof_current_rewrite_time_sec?: string               // -1
    aof_last_bgrewrite_status?: string                  // ok
    aof_last_write_status?: string                      // ok

    // 如果正在执行加载操作，将会添加这些额外的字段：
    loading_start_time?: string                         // 加载操作的开始时间（基于纪元的时间戳）
    loading_total_bytes?: string                        // 文件总大小
    loading_loaded_bytes?: string                       // 已经加载的字节数
    loading_loaded_perc?: string                        // 已经加载的百分比
    loading_eta_seconds?: string                        // 预计加载完成所需的剩余秒数

    // Stats
    total_connections_received?: string                 // 1058
    total_commands_processed?: string                   // 20227305
    instantaneous_ops_per_sec?: string                  // 0
    total_net_input_bytes?: string                      // 1528543656
    total_net_output_bytes?: string                     // 2155353808
    instantaneous_input_kbps?: string                   // 0.00
    instantaneous_output_kbps?: string                  // 0.00
    rejected_connections?: string                       // 0
    sync_full?: string                                  // 0
    sync_partial_ok?: string                            // 0
    sync_partial_err?: string                           // 0
    expired_keys?: string                               // 22616
    evicted_keys?: string                               // 0
    keyspace_hits?: string                              // 5059386
    keyspace_misses?: string                            // 1405484
    pubsub_channels?: string                            // 0
    pubsub_patterns?: string                            // 0
    latest_fork_usec?: string                           // 645
    migrate_cached_sockets?: string                     // 0

    // Replication
    role?: string                                       // master
    connected_slaves?: string                           // 0
    master_repl_offset?: string                         // 0
    repl_backlog_active?: string                        // 0
    repl_backlog_size?: string                          // 1048576
    repl_backlog_first_byte_offset?: string             // 0
    repl_backlog_histlen?: string                       // 0
    master_host?: string                                // 主节点的Host名称或IP地址
    master_port?: string                                // 主节点监听的TCP端口
    master_link_status?: string                         // 连接状态（up或者down）
    master_last_io_seconds_ago?: string                 // 自上次与主节点交互以来，经过的秒数
    master_sync_in_progress?: string                    // 指示主节点正在与从节点同步

    // CPU
    used_cpu_sys?: string                               // 2776.27
    used_cpu_user?: string                              // 2449.24
    used_cpu_sys_children?: string                      // 59.10
    used_cpu_user_children?: string                     // 1237.45

    // Cluster
    cluster_enabled?: string                            // 0

    // Keyspace
    db0?: string                                        // keys=3790,expires=2,avg_ttl=95446662632
}

export interface AlgorithmLCSResult {
    results: {
        /**
         * 第一个字符串的开始和结束位置。
         */
        k1: {
            start: number
            end: number
        }
        /**
         * 第二个字符串的开始和结束位置。
         */
        k2: {
            start: number
            end: number
        }
        /**
         * 这一部分的匹配长度。
         */
        length?: number
    }[]
    /**
     * 总的匹配长度，等于上面所有结果的长度和。
     */
    total_length: number
}

export interface RedisClientOptions {

    /**
     * server 的端口号。
     */
    port: number

    /**
     * server 的地址。
     */
    host: string

    /**
     * 选择的数据库，默认为 0。
     */
    db?: number

    /**
     * 密码。
     */
    auth_pass?: string

    /**
     * 是否启用 TLS，默认不启用。
     */
    is_tls?: boolean

    /**
     * Redis 连接的保活时间。
     */
    socket_keepalive?: boolean

    /**
     * Redis 连接初始化等待时间。
     */
    socket_initial_delay?: number

    /**
     * Redis 连接超时时间。
     */
    connect_timeout?: number

    /**
     * 是否启用 ready check。
     */
    no_ready_check?: boolean
}

export type CommandType =
    | 'write'
    | 'readonly'
    | 'denyoom'
    | 'admin'
    | 'pubsub'
    | 'noscript'
    | 'random'
    | 'sort_for_script'
    | 'loading'
    | 'stale'
    | 'skip_monitor'
    | 'asking'
    | 'fast'
    | 'movablekeys'

export interface CommandInfo {
    name: string
    args_count: number
    flag: CommandType[]
    first_key: number
    last_key: number
    key_step: number
}

export namespace RedisUtilType {

    /**
     * 联合 null 类型。
     */
    export type Nullable<T> = T | null

    /**
     * 判断 T 的类型是否是 Object 并且至少有一个属性字段。
     */
    export type NonEmptyObject<T extends { [key: string]: any }> = (keyof T) extends never ? 'Parameter need at least one property.' : T

}

export namespace RedisType {

    export type RedisValueType = 'string' | 'list' | 'set' | 'zset' | 'hash' | 'stream'
    export type RedisValueEncoding = 'raw' | 'embstr' | 'int' | 'ziplist' | 'linkedlist' | 'intset' | 'hashtable' | 'skiplist'
    export type Bit = 0 | 1
    export type Integer = number
    export type PositiveInteger = number
    export type NatureNumber = PositiveInteger | 0
    export type NegativeInteger = number

    export type MemberArray = string[]
    export type KeyMemberScore = [string, string, string]

    export type Db = number
    export type Key = string
    export type Field = string
    export type Member = string
    export type KeyPattern = string
    export type StringValue = string | Buffer
    export type StringDoubleValue = `${number}`
    export type KeyCount = Integer
    export type Timestamp = Integer
    export type MilliTimestamp = Integer
    export type TTL = PositiveInteger | -1 | -2
    export type PTTL = PositiveInteger | -1 | -2
    export type RedisValue = string | number | Buffer | null | RedisArray | ReplyError
    export type RedisArray = Array<RedisValue>

    export type ZsetRangeScoreMin = `(${number}` | `${number}` | '-inf' | '+inf'
    export type ZsetRangeScoreMax = `(${number}` | `${number}` | '-inf' | '+inf'
    export type ZsetRangeMemberMin = `[${string}` | `(${string}` | '-' | '+'
    export type ZsetRangeMemberMax = `[${string}` | `(${string}` | '-' | '+'

    export type MemberScoreArray =
        | [string, `${number}`]
        | [string, `${number}`, string, `${number}`]
        | [string, `${number}`, string, `${number}`, string, `${number}`]
        | [string, `${number}`, string, `${number}`, string, `${number}`, string, `${number}`]
        | [string, `${number}`, string, `${number}`, string, `${number}`, string, `${number}`, string, `${number}`]
        | [string, `${number}`, string, `${number}`, string, `${number}`, string, `${number}`, string, `${number}`, string, `${number}`]
        | [string, `${number}`, string, `${number}`, string, `${number}`, string, `${number}`, string, `${number}`, string, `${number}`, ...string[]]
    export type ScoreMemberArray =
        | [`${number}`, string]
        | [`${number}`, string, `${number}`, string]
        | [`${number}`, string, `${number}`, string, `${number}`, string]
        | [`${number}`, string, `${number}`, string, `${number}`, string, `${number}`, string]
        | [`${number}`, string, `${number}`, string, `${number}`, string, `${number}`, string, `${number}`, string]
        | [`${number}`, string, `${number}`, string, `${number}`, string, `${number}`, string, `${number}`, string, `${number}`, string]
        | [`${number}`, string, `${number}`, string, `${number}`, string, `${number}`, string, `${number}`, string, `${number}`, string, ...string[]]
}
