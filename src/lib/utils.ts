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
}
