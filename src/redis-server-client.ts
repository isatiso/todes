import { BaseClient } from './lib/client'
import { Command, CommandOptions } from './lib/command'
import { CommandInfo, RedisClientOptions, RedisType as R } from './lib/type'
import { RedisUtils } from './lib/utils'
import { RedisClientParams } from './redis-client.type'

export class RedisServerClient extends BaseClient {

    /**
     * ```
     * 起始版本：1.0.0
     * 时间复杂度：O(N)，N 为当前库中 key 的个数。
     * ```
     *
     * 清空当前数据库的全部 key。
     *
     * @category Server
     * @param async 是否异步执行， 4.0.0 开始支持。
     * @return
     *
     * *[查看原始定义](https://redis.io/commands/flushdb)*
     */
    flushdb(async?: boolean) {
        const args = async ? ['ASYNC'] : []
        return this.send_command(new Command<'OK'>('FLUSHDB', args))
    }

    // Server

    command() {
        return this.send_command(new Command<any[], { [key: string]: CommandInfo }>('COMMAND', [], undefined, data => RedisUtils.parse_command_info(data)))
    }

    command_info(command: string, ...commands: string[]) {
        return this.send_command(new Command<any[], { [key: string]: CommandInfo }>('COMMAND', ['INFO', command, ...commands], undefined, data => RedisUtils.parse_command_info(data)))
    }

    command_count() {
        return this.send_command(new Command<number, number>('COMMAND', ['COUNT']))
    }

    // command_getkeys() {
    //     return this.send_command(new Command<string[], string[]>('COMMAND', ['GETKEYS']))
    // }
}
