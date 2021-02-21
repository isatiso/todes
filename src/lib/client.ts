import Denque from 'denque'
import { EventEmitter } from 'events'
import { Command } from './command'
import { RedisConfig } from './config'
import { RedisConnection } from './connection'
import { RedisParser } from './parser'
import { RedisError } from './redis-errors'
import { REDIS_INFO_SECTION, RedisClientOptions, RedisServerInfo } from './type'
import { RedisUtils } from './utils'
import parse_redis_info = RedisUtils.parse_redis_info

export class BaseClient {

    private readonly heart_beat: NodeJS.Timeout
    private command_queue = new Denque<Command<any, any>>()
    private offline_queue = new Denque<Command<any, any>>()
    private config: RedisConfig
    private parser: RedisParser
    private connection: RedisConnection
    private ready = false
    private readonly eventbus = new EventEmitter()

    constructor(
        options: RedisClientOptions
    ) {
        this.config = new RedisConfig(options)
        this.parser = new RedisParser(this.eventbus, this.command_queue)
        this.eventbus.on('t_data', data => this.parser.execute?.(data))
        this.eventbus.on('t_error', desc => this.flush_error(desc?.code, desc?.message, desc?.error))
        this.eventbus.on('t_connect', () => {
            if (this.config.auth_pass) {
                this.ready = true
                this.auth(this.config.auth_pass).then()
                this.ready = false
            }
            this.config.no_ready_check ? this.on_ready() : this.ready_check()
        })
        this.connection = new RedisConnection(this.eventbus, this.config.connection)

        this.heart_beat = setInterval(() => {
            const cmd_created_at = this.command_queue.peekBack()?.created_at
            if (!cmd_created_at) {
                return
            }
            const now = new Date().getTime()
            if (cmd_created_at && now - cmd_created_at > this.config.max_waiting) {
                this.connection.destroy()
                this.ready = false
                this.flush_error('HEART_BEAT_TIMEOUT', `No response for heart beat over ${this.config.max_waiting} sec.`)
                this.connection = new RedisConnection(this.eventbus, this.config.connection)
                this.eventbus.emit('c_connect_reset')
            }
        }, 1000)
    }

    /**
     * [[include:server/info.md]]
     *
     * @category Server
     * @param section 只返回指定 section 的内容。
     * @return
     */
    info(section?: REDIS_INFO_SECTION) {
        const args = section ? [section] : []
        return this.send_command(new Command<string, RedisServerInfo>('INFO', args, undefined, res => parse_redis_info(res)))
    }

    /**
     * [[include:connection/ping.md]]
     *
     * @category Connection
     * @param msg 需要发送的信息，
     * @return
     */
    ping(msg?: string) {
        const args = msg ? [msg] : []
        return this.send_command(new Command<string>('PING', args))
    }

    /**
     * [[include:connection/echo.md]]
     *
     * @category Connection
     * @param message
     * @return
     */
    echo(message: string) {
        return this.send_command(new Command<string>('ECHO', [message]))
    }

    ping_test(msg?: string) {
        const args = msg ? [msg] : []
        return this.send_command(new Command<string>('PING', args))
    }

    /**
     * [[include:connection/quit.md]]
     *
     * @category Connection
     * @return
     */
    quit() {
        return this.send_command(new Command<'OK'>('QUIT', []), () => this.ready = false)
            .then(res => {
                this.connection.destroy()
                this.eventbus.removeAllListeners()
                clearInterval(this.heart_beat)
                return res
            })
    }

    /**
     * [[include:base/select.md]]
     *
     * @category Connection
     * @param db
     * @return
     *
     * *[查看原始定义](https://redis.io/commands/select)*
     */
    select(db: number) {
        return this.send_command(new Command<string, string>('SELECT', [db + '']))
    }

    protected send_command<T>(cmd: Command<any, T>, do_on_write?: () => void) {
        return new Promise<T>((resolve, reject) => {
            cmd.setResolver(resolve, reject)
            if (this.ready && this.connection.writable) {
                cmd.prepare().forEach(buf => this.connection.write(buf))
                this.command_queue.push(cmd)
            } else {
                this.offline_queue.push(cmd)
            }
            do_on_write?.()
        })
    }

    private auth(password: string) {
        return this.send_command(new Command<string, string>('AUTH', [password]))
    }

    private ready_check() {
        this.ready = true
        this.info().then(info => {
            if (info?.master_link_status && info.master_link_status !== 'up') {
                return setTimeout(() => this.ready_check(), 50)
            }
            if (info?.loading && info.loading !== '0') {
                return setTimeout(() => this.ready_check(), +(info?.loading_eta_seconds ?? 0.2) * 1000)
            }
            return this.on_ready()
        }).catch(err => {
            if (err.message === 'ERR unknown command \'info\'') {
                return this.on_ready()
            }
            return this.flush_error('READY_CHECK_FAILED', 'Ready check failed.', err)
        })
        this.ready = false
    }

    private on_ready() {
        this.ready = true
        this.select(this.config.selected_db).then()
        let command_obj = this.offline_queue.shift()
        while (command_obj) {
            this.command_queue.push(command_obj)
            command_obj.prepare().forEach(buf => this.connection.write(buf))
            command_obj = this.offline_queue.shift()
        }
        for (let command_obj = this.offline_queue.shift(); command_obj; command_obj = this.offline_queue.shift()) {
            this.command_queue.push(command_obj)
            command_obj.prepare().forEach(buf => this.connection.write(buf))
        }
    }

    private flush_error(code?: string, message?: string, error?: Error) {
        code = code ?? 'UNKNOWN_ERROR'
        message = message ?? 'connection broken.'
        const err = new RedisError(code, message, error)
        let command_obj = this.command_queue.shift()
        while (command_obj) {
            command_obj.reject(err)
            command_obj = this.command_queue.shift()
        }
        this.eventbus.emit('client_error', err)
    }
}
