> - **Redis官方文档**：https://redis.io/commands/expireat
> - **起始版本**：1.2.0
> - **时间复杂度**：O(1)

EXPIREAT 的行为和语义跟 [[RedisGenericClient.expire | EXPIRE]] 一样，区别是 EXPIREAT 的超时参数是时间戳形式。

它使用 UNIX Timestamp（1970年1月1日0时开始的秒数）。
传递一个过去的时间戳会导致直接删除这个 key。

关于过期时间的语义详情参考 [[RedisGenericClient.expire | EXPIRE]] 命令。

### 背景

EXPIREAT 的引入是为了在 AOF 持久化模式中，将相对过期时间转换为绝对过期时间。当然，它也可以用来直接指定一个 key 的过期时间点。

### 返回值

- `1`：ttl 设置成功。
- `0`：key 不存在，或者不能设置过期时间。

例子：

```typescript
await client.set('mykey', 'Hello')
// "OK"
await client.exists('mykey')
// 1
await client.expireat('mykey', 1293840000)
// 1
await client.exists('mykey')
// 0
```
