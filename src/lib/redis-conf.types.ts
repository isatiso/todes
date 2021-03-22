// General
export interface RedisConfTypes {

    // no
    daemonize: 'yes' | 'no'

    // /var/run/redis.pid
    pidfile: `/${string}`

    // 6379
    port: `${number}`

    // 511
    'tcp-backlog': `${number}`

    // 127.0.0.1
    bind?: `${number}.${number}.${number}.${number}`

    // /tmp/redis.sock
    unixsocket?: string

    // 700
    unixsocketperm?: `${number}`

    // 0
    timeout?: `${number}`

    // 0
    'tcp-keepalive': `${number}`

    // notice
    loglevel: 'debug' | 'verbose' | 'notice' | 'warning'

    logfile: ''

    // no
    'syslog-enabled'?: 'yes' | 'no'

    // redis
    'syslog-ident'?: 'redis'

    // 'local0'
    'syslog-facility'?: 'user' | `local${0 | 1 | 2 | 3 | 4 | 5 | 6 | 7}`

    // 16
    databases: `${number}`

}

// Snapshotting
export interface RedisConfTypes {

    // 900 1 300 10 60 10000
    save: string

    // yes
    'stop-writes-on-bgsave-error': 'yes' | 'no'

    // yes
    rdbcompression: 'yes' | 'no'

    // yes
    rdbchecksum: 'yes' | 'no'

    // dump.rdb
    dbfilename: string

    // ./
    dir: string
}
