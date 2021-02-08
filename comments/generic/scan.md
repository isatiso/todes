> - **Redis官方文档**：https://redis.io/commands/scan
> - **起始版本**：2.8.0
> - **时间复杂度**：每次调用复杂度为 O(1)，一次包括足够命令调用使游标回到 0 的完整迭代的复杂度为 O(N)。N 是集合内元素数量。

SCAN 命令和近似的 [[RedisSetClient.sscan | SSCAN]]，[[RedisHashClient.hscan | HSCAN]]，[[RedisSortedSetClient.zscan | ZSCAN]]
命令，是用来迭代集合内元素的。

- `SCAN` 用于迭代当前连接持有的 database 内的 key。
- `SSCAN` 用于迭代集合（set）内的成员。
- `HSCAN` 用于迭代哈希表（hash）内的成员及其值。
- `ZSCAN` 用于迭代排序集（zset）内的成员和分数。

由于这些命令允许增量迭代，每次调用只返回一小部分元素，所以在处理大集合类型时， 这些命令没有像 [[RedisGenericClient.keys | KEYS]]
，[[RedisSetClient.smembers | SMEMBERS]] 那样长时间阻塞服务的缺点，可以用于生产环境。

然而不像 [[RedisSetClient.smembers | SMEMBERS]] 这样的命令可以提供指定时间点的全部元素，[[RedisSetClient.sscan | SSCAN]]
只对返回的数据提供有限的保证，因为在增量迭代的过程中，集合可能发生改变。

SCAN，[[RedisSetClient.sscan | SSCAN]]，[[RedisHashClient.hscan | HSCAN]]，[[RedisSortedSetClient.zscan | ZSCAN]]
工作的方式十分近似，所以关于这部分文档包含了这四个命令。 另外还有一个显而易见的区别是，[[RedisSetClient.sscan | SSCAN]]，[[RedisHashClient.hscan | HSCAN]]
，[[RedisSortedSetClient.zscan | ZSCAN]] 的第一个参数始终是这些集合类型对应的 key。SCAN 不需要提供任何 key 的参数，所以它迭代的是这个 database 本身。

### SCAN 的基础用法

SCAN 是一种基于游标的迭代。这意味着每次调用都会返回新的游标位置用于下次调用。

当游标设置为 0 时，表示开始一次新的迭代。而当返回的游标也是 0 的时候表示迭代结束。下面是一个 SCAN 的调用例子：

```typescript
await client.scan('0')
// { "cursor": "14", "keys": [
//     "key:14", "key:6", "key:13", "key:5", "key:2",
//     "key:18", "key:0",  "key:16", "key:10", "key:17"
// ] }
await client.scan('14')
// { "cursor": "0", "keys": [
//     "key:7",  "key:8", "key:4",  "key:3", "key:11",
//     "key:9", "key:19", "key:1", "key:12", "key:15"
// ] }
```

在上面的例子中，第一次调用使用 0 作为游标值，表示开始一次迭代。 第二次调用的游标值，使用前一次调用返回的游标值 `'14'`。
你可以看到 SCAN 的返回值是一个二元组，第一个值是游标，第二个值是这次迭代的返回内容。

第二次调用时返回的游标是 0，意味着这次迭代已经结束，集合已经被完整遍历过。从使用 0 调用 SCAN 开始，到返回的 cursor 变为 0，这被称为一次**完整迭代（full iteration）**。

### SCAN 的保证

SCAN 家族的命令可以提供一些列的保证：

- 如果一个元素在迭代的过程中始终在集合里，则它一定会被返回给用户。
- 如果一个元素在迭代的过程中始终没有出现在集合里，则它一定不会被返回给用户。

由于 SCAN 命令仅保存了很少的关联状态（仅限游标），因此具有以下缺点：

- 给定的元素可能被多次返回。这取决于应用如何处理重复元素，例如只用返回值执行幂等操作。
- 在完整迭代过程中不是一直出现的元素，不一定会被返回。它的行为是未定义的。

### 每次迭代返回的元素个数

SCAN 家族命令不保证每次调用的返回数量是指定值。命令也可能返回 0 个元素，但只要返回的游标不是 0，客户端就不应该认为迭代结束。

SCAN 命令返回数量也有一些规则，从实用角度出发，对于一个大型的集合，每次可能只返回几十条数据，而对于一些足够小的集合，可能一次返回全部数据。

用户可以使用 count 选项调整每次返回元素的数量级。

### count 选项

尽管 SCAN 不保证每次迭代返回的元素数量，但是可以使用 count 选项根据经验调整 SCAN 的行为。
基本上 count 指定的是每次调用时从集合中检索元素的工作量。这只是实现方式的一个比喻，但一般情况下，你可以期望它的行为就是这样。

- 默认的 count 值为 0。
- 对于哈希类型的数据结构，假设没有使用 match 选项，每次调用服务器一般会返回 count 或者比 count 稍多一些的元素。
- 当 set 的编码为 intset（又整数组成的小集合）时，或者 hash 和 zset 编码为 ziplist（由个别小型值组成的 hash 或者 zset），不管 count 设置何值，在第一次调用时就会返回全部元素。

**注意**：**不需要为每次调用传递相同的 count 参数**。只要每次调用的游标值是从上次一调用结果获得的，调用者可以按需调整 count 值。

### match 选项

可以使用 glob 风格的模式对 scan 的返回结果进行过滤。它的行为类似于 [[RedisGenericClient.keys | KEYS]]。

使用 match 选项可以启用这种过滤模式，SCAN 家族的命令都支持这个选项。

下面是使用 match 选项的一个例子：

```typescript
await client.sadd('myset', '1', '2', '3', 'foo', 'foobar', 'feelsgood')
// 6
await client.sscan('myset', '0', { match: 'f*' })
// { "cursor": "0", "keys": [
//     "foo", "feelsgood", "foobar"
// ] }
```

需要注意的是，match 是在已经获取了元素之后，返回之前进行的过滤。这意味着如果 match 只匹配了集合重很小一部分元素，SCAN 命令可能在大多数的迭代中返回空数组。下面是一个例子：

```typescript
    const a: string[] = []
    for (let i = 0; i < 1000; i++) {
        a.push('key:' + i)
    }
    await Promise.all(a.map(k => client.set(k, '1')))
    let res: { cursor: string, keys: string[] } | undefined
    while (true) {
        res = await client.scan(res?.cursor ?? 0, { match: '*11*', count: 100 })
        console.log(res)
        if (res.cursor === '0') {
            break
        }
    }
    /**
     * { cursor: '792', keys: [ 'key:611' ] }
     * { cursor: '780', keys: [ 'key:116', 'key:511' ] }
     * { cursor: '914', keys: [ 'key:114', 'key:119', 'key:711' ] }
     * { cursor: '358', keys: [ 'key:112', 'key:411', 'key:118', 'key:211' ] }
     * { cursor: '62', keys: [] }
     * { cursor: '617', keys: [ 'key:110' ] }
     * { cursor: '141', keys: [ 'key:311', 'key:11' ] }
     * { cursor: '179', keys: [ 'key:911', 'key:113', 'key:115' ] }
     * { cursor: '487', keys: [ 'key:111' ] }
     * { cursor: '0', keys: [ 'key:117', 'key:811' ] }
     */
```

如上所示，在一个 1000 个元素的集合中进行迭代，指定每次迭代的数量大致为 100 个，此时只返回几个 key 甚至还有空的结果。

### type 选项

在 Redis 6.0 版本开始，你可以使用 type 选项根据值类型进行返回值过滤。type 选项只在 SCAN 命令中生效，因为 SCAN 家族其他命令迭代的值对应的都是固定类型。

type 参数的可选项跟 [[RedisGenericClient.type | TYPE]] 命令的返回值一样。

但是请注意，一些 Redis 的值类型实际上的存储类型为几个基本类型，比如 GeoHashs，HyperLogLogs，Bitmaps，Bitfields，他们的实现方式就是其他的内置类型，
比如 string 或者 zset，所以它们不能通过 type 选项区分。例如 GeoHash 和 zset:

```typescript

```

type 的过滤时机和 match 选项一样，所以 type 选项同样不能减少服务器遍历集合的工作量，而且对于一些比较少的类型，会得到很多空数组的返回结果。

### 多次并行迭代

同一时间可以有不限个数的客户端同时进行迭代，因为迭代的状态只有游标值，他只是在每次调用和返回时出现，而服务器不保存任何迭代状态。

### 中途终止迭代

鉴于全部迭代信息都保存在游标中，服务端没有保存任何迭代信息，调用者可以随时终止迭代而不需要通知服务端。存在任意数量的未完成迭代不会引起服务端的任何问题。

### 使用非法游标调用 SCAN 命令

使用错误的，超出范围的，负的，或者其他非法的游标会导致未定义的行为，但并不会导致崩溃。未定义的只是所有 SCAN 命令对于返回值的保证不再有效。

有效的游标：
- 游标值 `'0'` 表示迭代开始。
- 前次调用返回的游标值。

### 终止保证

只有在迭代集合的大小保持在一定范围内时，才能保证 SCAN 算法的终止，否则，对一直增长的集合进行迭代可能会导致 SCAN 算法永不终止。
这很好理解，随着集合增长，遍历集合需要执行的工作就越来越多，所以能否终止取决于 SCAN 的调用次数和 count 参数跟集合的增长率相比谁大谁小。

### 为什么 SCAN 有可能在一次调用中返回聚合数据类型的全部元素

在前面 count 相关的文档中提到又是在 set，hash，zset 中使用 SCAN 家族命令时可能在单次调用中返回全部元素，而不管 count 设置为多少。
原因是只有当我们要扫描的聚合数据类型表示为哈希表时，才可以实现基于游标的迭代器。
然而 Redis 在聚合数据类型比较小的时候使用紧凑型的一次性打包编码方式，这样可以节省内存，直到元素的数量达到一定等级，或者单个元素大小超过限制。
在这种情况下，Redis 无法返回有效的游标，又必须迭代完整的数据，此时能做的只有将元素全部返回。

然而一旦数据大小超过限制，改为使用哈希表存储的方式，SCAN 命令就会执行正常的迭代操作。这种特殊的行为仅发生在小型数据类型上，所以它对命令的复杂度没有实际意义的影响。
转换为真实哈希表的限制是用户可配置的，所以单次调用中返回的最大元素数量实际上取决于打包格式的最大限制大小。
还有就是，这种特殊的行为只发生在 SSCAN HSCAN ZSCAN 上，SCAN 本身绝不会发生这种行为，因为 database 的 key 始终是以哈希表形式存储的。

### 返回值


