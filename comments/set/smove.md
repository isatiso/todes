> - **Redis官方文档**：https://redis.io/commands/smove
> - **起始版本**：1.0.0
> - **时间复杂度**：O(1)

从 source set 移动一个成员到 destination set。

- 该操作是原子性的，任意时刻对于其他客户端来说，member 要么在 source 中，要么在 destination 中。
- 如果 source set 不存在，或者没有包含 member，则不会发生任何操作。否则，member 会被从 source set 移除，并添加到 destination set。
- 如果 destination 中已经存在了 member，则该操作只会从 source set 中移除 member。

返回值含义：
- `1` 从 source set 中移除了 member。
- `0` source set 不存在，或者 source set 中不包含 member。

例子：

```typescript
await client.sadd('myset', 'one', 'two')
// 2
await client.sadd('myotherset', 'three')
// 1
await client.smove('myset', 'myotherset', 'two')
// 1
await client.smembers('myset')
// ["one"]
await client.smembers('myotherset')
// ["two", "three"]
```
