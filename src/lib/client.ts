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

export class RedisClient extends EventEmitter {

    private command_queue = new Denque<Command<any, any>>()
    private offline_queue = new Denque<Command<any, any>>()
    private config: RedisConfig
    private parser: RedisParser
    private connection: RedisConnection
    private ready = false

    constructor(
        options: RedisClientOptions
    ) {
        super()
        this.config = new RedisConfig(options)
        this.parser = new RedisParser(this, this.command_queue)
        this.on('t_data', data => this.parser.execute?.(data))
        this.on('t_error', desc => this.flush_error(desc?.code, desc?.message, desc?.error))
        this.on('t_connect', () => {
            if (this.config.auth_pass) {
                this.ready = true
                this.auth(this.config.auth_pass).then()
                this.ready = false
            }
            this.config.no_ready_check ? this.on_ready() : this.ready_check()
        })
        this.connection = new RedisConnection(this, this.config.connection)
    }

    info(section?: REDIS_INFO_SECTION) {
        const args = section ? [section] : []
        return this.send_command(new Command<string, RedisServerInfo>('INFO', args, undefined, res => parse_redis_info(res)))
    }

    ping(msg?: string) {
        const args = msg ? [msg] : []
        return this.send_command(new Command<string>('PING', args))
    }

    echo(message: string) {
        return this.send_command(new Command<string>('ECHO', [message]))
    }

    quit() {
        return this.send_command(new Command<'OK'>('QUIT', []), () => this.ready = false)
            .then(() => this.connection.destroy())
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
        })
    }

    private auth(password: string) {
        return this.send_command(new Command<string, string>('AUTH', [password]))
    }

    private select(db: number) {
        return this.send_command(new Command<string, string>('SELECT', [db + '']))
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
            return this.flush_error('READY_CHECK_FAILED')
        })
        this.ready = false
    }

    private on_ready() {
        this.ready = true
        this.select(this.config.selected_db).then()
        for (let command_obj = this.offline_queue.shift(); command_obj; command_obj = this.offline_queue.shift()) {
            this.command_queue.push(command_obj)
            command_obj.prepare().forEach(buf => this.connection.write(buf))
        }
    }

    private flush_error(code?: string, message?: string, error?: Error) {
        code = code ?? 'UNKNOWN_ERROR'
        message = message ?? 'connection broken.'
        const err = new RedisError(code, message)
        for (let command_obj = this.command_queue.shift(); command_obj; command_obj = this.command_queue.shift()) {
            command_obj.reject(err)
        }
        this.emit('fatal_error', err)
    }
}