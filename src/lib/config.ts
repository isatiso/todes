import * as net from 'net'
import { RedisClientOptions } from './type'

export interface RetryStrategyParams {
    attempt: number
    total_retry_time: number
    times_connected: number
    error?: Error
}

export interface RedisConnectionOptions {

    retry_strategy?: (params: RetryStrategyParams) => number

    is_tls: boolean
    connect_timeout?: number
    keepalive?: boolean
    initial_delay?: number

    address: string
    connection: {
        path: string
    } | {
        port: number
        host: string
        family: number
    }
}

export class RedisConfig {

    private readonly _connection_config: RedisConnectionOptions
    selected_db: number
    auth_pass?: string
    no_ready_check: boolean
    max_waiting: number

    constructor(
        options: RedisClientOptions
    ) {
        this.max_waiting = options.max_waiting ?? 30000
        this._connection_config = {
            is_tls: options.is_tls ?? false,
            connect_timeout: options.connect_timeout ?? 0,
            keepalive: options.socket_keepalive ?? true,
            initial_delay: options.socket_initial_delay ?? 0,
        } as any
        const host = options.host ?? '127.0.0.1'
        this._connection_config.connection = {
            port: options.port ?? 6379,
            host: host,
            family: net.isIP(host)
        }
        this._connection_config.address = this._connection_config.connection.host + ':' + this._connection_config.connection.port

        this.selected_db = options.db ?? 0
        this.auth_pass = options.auth_pass
        this.no_ready_check = options.no_ready_check ?? false
    }

    get connection() {
        return this._connection_config
    }
}
