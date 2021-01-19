> - **Redis官方文档**：https://redis.io/commands/bitfield
> - **起始版本**：3.2.0
> - **时间复杂度**：每个子命令的复杂度为 O(1)

该命令将 Redis 字符串视为位数组，并且能够处理指定偏移量和位宽（不超过64bit）的整数字段，以及配置特定的溢出策略。

支持四种子命令：

- [[`RedisClientParams.BitField.BitFieldGet` | GET <type> <offset>]]：返回指定的位置的 bitfield。
- `SET <type> <offset> <value>`：设置指定的位置的 bitfield，并返回旧的 bitfield。
- `INCRBY <type> <offset> <increment>`：增加或减少指定偏移量和范围的 bitfield，并返回改变后的结果。
- `OVERFLOW [WRAP|SAT|FAIL]`：通过设置不同的溢出策略修改连续调用 INCRBY 子命令的行为。

返回子命令处理结果的列表。详细使用方式参见 [[RedisClientParams.BitField | pipeline 类型说明]]。

例子：

```typescript
await client.bitfield('mykey', [
    ['INCRBY', 'i5', 100, 1],
    ['GET', 'u4', 0,],
]) // [1, 0]
```

```typescript
await client.bitfield('mystring', [
    ['SET', 'i8', '#0', 100],
    ['SET', 'i8', '#1', 200],
])
```

这里展示了不同溢出策略的效果：

```typescript
await client.bitfield('mykey', [
    ['INCRBY', 'u2', 100, 1],
    ['OVERFLOW', 'SAT'],
    ['INCRBY', 'u2', 102, 1],
]) // [1, 1]
await client.bitfield('mykey', [
    ['INCRBY', 'u2', 100, 1],
    ['OVERFLOW', 'SAT'],
    ['INCRBY', 'u2', 102, 1],
]) // [2, 2]
await client.bitfield('mykey', [
    ['INCRBY', 'u2', 100, 1],
    ['OVERFLOW', 'SAT'],
    ['INCRBY', 'u2', 102, 1],
]) // [3, 3]
await client.bitfield('mykey', [
    ['INCRBY', 'u2', 100, 1],
    ['OVERFLOW', 'SAT'],
    ['INCRBY', 'u2', 102, 1],
]) // [0, 3]
```
