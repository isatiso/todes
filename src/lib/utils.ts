import { RedisServerInfo } from './type'

export namespace RedisUtils {
    export function parse_redis_info(input: string): RedisServerInfo {
        return Object.fromEntries(
            input?.split('\r\n')
                .filter(s => s.indexOf(':') !== -1)
                .map(s => {
                    const [k, v] = s.split(':')
                    if (v.indexOf('=') !== -1) {
                        const value = Object.fromEntries(v.split(',').map(k => k.split('=')))
                        return [k, value]
                    } else {
                        return [k, v]
                    }
                }) ?? [])
    }

    export function parse_command_info(command_info: any[]) {
        return Object.fromEntries(command_info.map(
            t => [t[0], { name: t[0], args_count: t[1], flag: t[2], first_key: t[3], last_key: t[4], key_step: t[5] }]))
    }
}
