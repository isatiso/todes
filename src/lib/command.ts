import { RedisError } from './redis-errors'

export interface CommandOptions {
    return_buffer?: boolean
    string_number?: boolean
}

export class Command<I, T extends any = I> {

    readonly string_number: boolean
    readonly return_buffer: boolean
    private _resolve?: (data: T) => void
    private _reject?: Function

    constructor(
        public command: string,
        public args: (string | Buffer)[],
        options?: CommandOptions,
        public result_map?: (data: I) => T
    ) {
        this.command = this.command.toUpperCase()
        this.args.forEach((arg, i) => {
            if (typeof arg !== 'string' && !Buffer.isBuffer(arg)) {
                throw new RedisError('INVALID_ARGUMENTS', `args[${i}] is invalid, need <string> or <Buffer>`)
            }
        })
        this.string_number = options?.string_number ?? false
        this.return_buffer = options?.return_buffer ?? false
    }

    private _promised = false
    get promised() {
        return this._promised
    }

    setResolver(resolve: Function, reject: Function) {
        this._promised = true
        this._reject = reject
        this._resolve = (data: any) => {
            try {
                if (this.result_map) {
                    data = this.result_map?.(data)
                }
                resolve(data)
            } catch (e) {
                this._reject?.(e)
            }
        }
    }

    resolve(data: any) {
        if (!this._resolve) {
            throw new Error('No Resolve Function in Command Object.')
        }
        return this._resolve?.(data)
    }

    reject(err: Error) {
        if (!this._reject) {
            throw new Error('No Reject Function in Command Object.')
        }
        return this._reject?.(err)
    }

    prepare() {
        const result: Array<Buffer | string> = [`*${this.args.length + 1}\r\n$${this.command.length}\r\n${this.command}\r\n`]
        for (const arg of this.args) {
            if (typeof arg === 'string' && arg.length < 30000) {
                result[result.length - 1] += `$${Buffer.byteLength(arg)}\r\n${arg}\r\n`
            } else {
                result.push(Buffer.isBuffer(arg) ? arg : Buffer.from(arg))
                result.push('\r\n')
            }
        }
        return result
    }
}
