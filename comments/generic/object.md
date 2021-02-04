> - **Redis官方文档**：https://redis.io/commands/object
> - **起始版本**：2.2.3
> - **时间复杂度**：O(1)

OBJECT 命令允许检查 Redis 对象的内部形式。这对于调试或者需要了解 key 是否使用了特殊编码来节省空间时特别有用。 将 Redis 用作缓存时，还可以根据 OBJECT 命令的报告实现应用级的密钥回收策略。

OBJECT 命令支持下列四种子命令：

- `REFCOUNT` 返回值的引用数，主要用于调试。
- `ENCODING` 返回内部存储值使用的编码形式。
- `IDLETIME` 返回指定 key 的空闲（没有读写操作）时间，单位秒。但是此计时器的实际分辨率是 10 秒。未来可能会做改进。 当 maxmemory-policy 设置为 LRU 或者 noeviction 并且设置了
  maxmemory 时，此子命令可用。

- `FREQ` 返回 key 对应的对数访问频率计数器。当 maxmemory-policy 设为 LFU 可用。
- `HELP` 返回简单的帮助文本。

### 对象编码格式

- **string** 可以编码为 `raw`（常规字符串编码），`embstr` （专门用于保存短字符串）或 `int`（以64位有符号间隔表示整数的字符串以这种方式编码，以节省空间）。
- **list** 可以编码为 `ziplist` 或 `linkedlist`。ziplist 是一种特殊的表示形式，用于节省小 **list** 的空间。
- **set** 可以编码为 `intset` 或 `hashtable`。intset 是一种特殊的编码，用于仅由整数组成的小 **set**。
- **hash** 可以编码为 `ziplist` 或 `hashtable`。ziplist 是用于小 **hash** 的特殊编码。
- **zset** 可以编码为 `ziplist` 或 `skiplist` 格式。ziplist 适用于小的 **list** 和 **zset**，skiplist 编码则适用于任何大小的 **zset**。

一旦执行了使 Redis 无法保留节省空间编码的操作，所有特殊编码类型会被自动转换为通用编码类型。

### 返回值

不同的子命令有不同的返回值。详见不同子命令的定义。 当要检查的 object 不存在，会返回 null。

例子：

```typescript
await client.lpush('mylist', 'Hello World')
// 1
await client.object('REFCOUNT', 'mylist')
// 1
await client.object('ENCODING', 'mylist')
// "quicklist"
await client.object('IDLETIME', 'mylist')
// 0
```

下面的例子展示了编码是如何变化的：

```typescript
await client.set('foo', '1000')
// "OK"
await client.object('ENCODING', 'foo')
// "int"
await client.append('foo', 'bar')
// 7
await client.get('foo')
// "1000bar"
await client.object('ENCODING', 'foo')
// "raw"
```
