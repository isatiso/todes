import { AlgorithmLCSResult, RedisServerInfo } from './type'

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

    export function parse_stralgo_lcs_result(input: any): AlgorithmLCSResult {
        return {
            results: input[1].map((res: any) => ({
                k1: { start: res[0][0], end: res[0][1] },
                k2: { start: res[1][0], end: res[1][1] },
                length: res[2] ?? res[0][1] - res[0][0] + 1
            })),
            total_length: input[3]
        }
    }

    export function parse_command_info(command_info: any[]) {
        return Object.fromEntries(command_info.map(
            t => [t[0], { name: t[0], args_count: t[1], flag: t[2], first_key: t[3], last_key: t[4], key_step: t[5] }]))
    }
}

/**
 * 字符串拼接 Buffer 的 工具。
 *
 * @param template
 * @param args
 */
export function buf(template: TemplateStringsArray, ...args: (number[] | string | Buffer)[]) {
    const arr: Buffer[] = []
    for (let i = 0; i < template.length; i++) {
        arr.push(Buffer.from(template[i]))
        if (i !== template.length - 1) {
            const arg = args[i]
            arr.push(Buffer.isBuffer(arg) ? arg : Buffer.from(arg))
        }
    }
    return Buffer.concat(arr)
}
