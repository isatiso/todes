> - **Redis官方文档**：https://redis.io/commands/sadd
> - **起始版本**：1.0.0
> - **时间复杂度**：每一个 member 添加的复杂度为 O(1)，所以添加 N 个 member 的复杂度是 O(N)。

向指定 set 添加 member，返回添加进 set 的 member 个数。

- 添加时 set 中已经存在的 member 会被忽略。
- 如果 key 不存在会先创建一个 set。
- 如果 key 存储的值不是 set 类型，会抛出 WRONGTYPE Error。

**注意**：2.4 版本开始接受多个 member 参数。更早的版本一次命令只能添加一个 member。

例子：

```typescript
await client.sadd('myset', 'Hello')
// 1
await client.sadd('myset', 'World')
// 1
await client.sadd('myset', 'World')
// 0
await client.smembers('myset')
// ["World", "Hello"]
```
