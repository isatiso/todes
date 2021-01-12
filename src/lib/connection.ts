import { EventEmitter } from 'events'
import net from 'net'
import tls from 'tls'
import { RedisConnectionOptions } from './config'
import { RedisConnectionError } from './redis-errors'

export class RedisConnection {

    private readonly stream: net.Socket
    private should_buffer = false

    constructor(
        private event_emitter: EventEmitter,
        private options: RedisConnectionOptions,
    ) {
        this.stream = this.options.is_tls
            ? tls.connect(this.options.connection)
            : net.createConnection(this.options.connection)

        this.stream.once(this.options.is_tls ? 'secureConnect' : 'connect', () => this.on_connect())
        this.stream.once('close', () => this.destroy())
        this.stream.once('end', () => this.destroy())
        this.stream.on('data', buffer => this.event_emitter.emit('t_data', buffer))
        this.stream.on('error', err => this.on_error(err))
        this.stream.on('drain', () => this.should_buffer = false)
        // TODO: 根据 drain 做限流
        this.stream.setNoDelay()
    }

    private _connected = false
    get connected(): boolean {
        return this._connected && !this.stream.destroyed
    }

    get writable() {
        return this.stream.writable
    }

    destroy() {
        this._connected = false
        this.event_emitter.removeAllListeners()
        this.stream.removeAllListeners()
        this.stream.destroy()
    }

    write(data: Buffer | string): void {
        if (!this.stream || !this._connected) {
            throw new RedisConnectionError('NOT_CONNECTED_YET', '<connect> should be called before other method calling.')
        }
        this.should_buffer = !this.stream.write(data)
    }

    private on_connect(): void {
        this._connected = true
        this.stream.setKeepAlive(this.options.keepalive, this.options.initial_delay)
        this.stream.setTimeout(0)
        this.event_emitter.emit('t_connect')
    }

    private on_error(err: Error) {
        // TODO: 整理错误信息
        this.event_emitter.emit('t_error', new RedisConnectionError('SOCKET_ERROR', '', err))
        if (this._connected) {
            this.destroy()
        }
    }
}
