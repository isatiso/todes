import { EventEmitter } from 'events'
import net from 'net'
import tls from 'tls'
import { RedisConnectionOptions } from './config'
import { Deque } from './queue'
import { RedisConnectionError } from './redis-errors'

export class RedisConnection {

    private readonly stream: net.Socket
    private readonly buffer = new Deque<Buffer | string>()
    private should_buffer = false

    constructor(
        private eventbus: EventEmitter,
        private options: RedisConnectionOptions,
    ) {
        this.stream = this.options.is_tls
            ? tls.connect(this.options.connection)
            : net.createConnection(this.options.connection)

        this.stream.once(this.options.is_tls ? 'secureConnect' : 'connect', () => this.on_connect())
        this.stream.once('close', () => this.destroy())
        this.stream.once('end', () => this.destroy())
        this.stream.on('data', buffer => this.eventbus.emit('t_data', buffer))
        this.stream.on('error', err => this.on_error(err))
        this.stream.on('drain', () => this.on_drain())
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
        this.stream.removeAllListeners()
        this.stream.destroy()
    }

    /**
     *
     * @param data Data to send on the socket.
     * @return `true` if the entire data was flushed successfully to the kernel buffer. `false` if all or part of the data was queued in user memory.
     */
    write(data: Buffer | string): boolean {
        if (!this.stream || !this._connected) {
            throw new RedisConnectionError('NOT_CONNECTED_YET', '<connect> should be called before other method calling.')
        } else if (this.should_buffer) {
            this.buffer.push(data)
        } else {
            this.should_buffer = !this.stream.write(data)
        }
        return this.should_buffer
    }

    private on_drain() {
        this.should_buffer = false
        while (true) {
            const buf = this.buffer.shift()
            if (!buf) {
                return
            }
            if (this.write(buf)) {
                return
            }
        }
    }

    private on_connect(): void {
        this._connected = true
        this.stream.setKeepAlive(this.options.keepalive, this.options.initial_delay)
        this.stream.setTimeout(0)
        this.eventbus.emit('t_connect')
    }

    private on_error(err: Error) {
        this.eventbus.emit('t_error', new RedisConnectionError('SOCKET_ERROR', '', err))
        if (this._connected) {
            this.destroy()
        }
    }
}
