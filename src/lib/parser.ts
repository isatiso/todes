import { EventEmitter } from 'events'
import { Command } from './command'
import { Deque } from './queue'
import { ParserError, ReplyError, throw_to_be_continue, ToBeContinue } from './redis-errors'
import { RedisType } from './type'
import RedisArray = RedisType.RedisArray
import RedisValue = RedisType.RedisValue

export class RedisParser {

    private offset = 0
    private buffer?: Buffer
    private array_cache?: RedisArray
    private array_item?: RedisValue
    private string_cache: Buffer[] = []
    private string_cache_size = 0
    private string_size = 0
    private command?: Command<any>

    constructor(
        private event_emitter: EventEmitter,
        private command_queue: Deque<Command<any>>,
    ) {
    }

    execute?: (buffer: Buffer) => void = buffer => {
        try {
            this.check_continuous(buffer)
            while (this.offset < this.buffer!.length) {
                this.command = this.command_queue.peekBack()
                if (!this.command) {
                    this.execute = undefined
                    return this.event_emitter.emit('p_error', ParserError.create('Empty Command Queue.'))
                }
                this.resolve(this.parse_type())
            }
            this.buffer = undefined
        } catch (err) {
            if (err instanceof ToBeContinue) {
            } else {
                this.execute = undefined
                return this.event_emitter.emit('p_error', err)
            }
        }
    }

    private resolve(data: RedisValue) {
        if (data instanceof ReplyError) {
            return this.command_queue.shift()?.reject(data)
        }
        if (Array.isArray(data)) {
            this.array_cache = undefined
        }
        this.command_queue.shift()?.resolve(data)
        // 1024 * 1024
        if (this.buffer && this.offset > 1048576) {
            this.buffer = this.buffer!.slice(this.offset)
            this.offset = 0
        }
    }

    private slice(start: number, end: number): Buffer {
        this.offset = end + 2
        return this.buffer!.slice(start, end)
    }

    private check_continuous(buffer: Buffer) {
        if (!this.buffer) {
            this.buffer = buffer
            this.offset = 0
        } else if (!this.string_cache.length) {
            this.buffer = Buffer.concat([this.buffer!, buffer])
        } else if (this.array_cache) {
            this.array_item = this.continue_parse_string(buffer)
        } else {
            this.resolve(this.continue_parse_string(buffer))
        }
        if (this.array_cache) {
            this.parse_array(this.array_cache)
            this.resolve(this.array_cache!)
        }
    }

    private continue_parse_string(buffer: Buffer) {
        this.string_cache.push(buffer)
        this.string_cache_size += buffer.length
        if (this.string_cache_size < this.string_size + 2) {
            throw_to_be_continue()
        }
        this.buffer = Buffer.concat(this.string_cache)
        this.string_cache = []
        return this.command!.return_buffer
            ? this.slice(0, this.string_size)
            : this.slice(0, this.string_size).toString('utf8')
    }

    private parse_type(type?: number): RedisValue {
        switch (type ?? this.buffer![this.offset] ?? throw_to_be_continue()) {
            case 58: // : integer
                return this.command!.string_number ? this.parse_simple() : +this.parse_simple()
            case 43: // + string
                return this.parse_simple()
            case 36: // $ fix length string
                return this.parse_string(+this.parse_simple())
            case 42: // * array
                return this.parse_array(this.create_array(+this.parse_simple()) as RedisArray)
            case 45: // - error message
                return new ReplyError(this.parse_simple())
            default:
                const type = String.fromCharCode(this.buffer![this.offset])
                throw ParserError.create(
                    `Protocol error, got ${JSON.stringify(type)} as reply type byte`,
                    JSON.stringify(this.buffer?.toString()), this.offset)
        }
    }

    private parse_simple(): string {
        const end = this.buffer!.indexOf(13, this.offset + 1)
        return end !== -1 && end + 2 <= this.buffer!.length
            ? this.slice(this.offset + 1, end).toString('utf8')
            : throw_to_be_continue()
    }

    private parse_string(length: number): string | Buffer | null {
        if (length < 0) {
            return null
        }
        if (this.offset + length + 2 > this.buffer!.length) {
            this.string_size = length
            this.string_cache_size = this.buffer!.length - this.offset
            this.string_cache.push(this.buffer!.slice(this.offset))
            this.offset = 0
            throw_to_be_continue()
        }
        return this.command!.return_buffer
            ? this.slice(this.offset, this.offset + length)
            : this.slice(this.offset, this.offset + length).toString('utf8')
    }

    private create_array(length: number): RedisArray | null {
        if (length < 0) {
            return null
        }
        const arr = new Array(length)
        if (!this.array_cache) {
            this.array_cache = arr
        }
        return arr
    }

    private parse_array(arr: RedisArray | null): RedisArray | null {
        if (arr) {
            for (let i = 0; i < arr.length; i++) {
                if (arr[i] === undefined) {
                    if (this.array_item) {
                        arr[i] = this.array_item
                        this.array_item = undefined
                    } else if (this.buffer![this.offset] === 42) {
                        arr[i] = this.create_array(+this.parse_simple())
                        this.parse_array(arr[i] as RedisArray)
                    } else {
                        arr[i] = this.parse_type(this.buffer![this.offset])
                    }
                } else if (Array.isArray(arr[i])) {
                    this.parse_array(arr[i] as RedisArray)
                }
            }
        }
        return arr
    }
}
