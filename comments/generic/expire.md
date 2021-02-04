> - **Redis官方文档**：https://redis.io/commands/expire
> - **起始版本**：1.0.0
> - **时间复杂度**：O(1)

对 key 设置一个过期时间。当 key 到期后会被自动删除。

在 Redis 术语中，这种带有过期时间的 key 被称为 **volatile** 的 key。

在执行重写 key 值的命令的时候，比如 [[RedisGenericClient.del | DEL]]，[[RedisStringClient.set | SET]]，[[RedisStringClient.getset | GETSET]] 和 *STORE 的命令，会清除过期时间。
这意味着所有在概念上更改存储在 key 上的值而不是用新 key 替换旧 key 的操作都将保持过期时间不变。
例如：[[RedisStringClient.incr | INCR]]，[[RedisListClient.lpush | LPUSH]]，[[RedisHashClient.hset | HSET]]。

可以使用 [[RedisGenericClient.persist | PERSIST]] 命令清除过期时间。

如果通过 [[RedisGenericClient.rename | RENAME]] 命令进行重命名，则旧 key 的过期时间会被赋给新的 key。
此时如果新的 key 已经存在，则它的过期时间会被旧的 key 覆盖。

**注意**：使用一个负数参数调用 [[RedisGenericClient.expire | EXPIRE]]/[[RedisGenericClient.pexpire | PEXPIRE]] 命令时，实际执行的是删除操作。此时收到的 key event 是删除，而不是过期。

### 刷新过期时间

[[RedisGenericClient.expire | EXPIRE]] 命令可以作用于一进存在过期时间的 key。此时会用新的过期时间覆盖旧的。
一个常见的例子是【导航会话】模式。

### 2.1.3 版本差异

2.1.3 版本之前，修改一个带有过期时间的 key 会导致这个 key 被删除，这是受当时复制层的限制而导致的。而这一限制已经被修复，所以 2.1.3 版本开始可以修改带有过期时间的 key。

### 返回值

- `1`：ttl 设置成功。
- `0`：key 不存在，或者不能设置过期时间时。

例子：

```typescript
await client.set('mykey', 'Hello')
// "OK"
await client.expire('mykey', 10)
// 1
await client.ttl('mykey')
// 10
await client.set('mykey', 'Hello World')
// "OK"
await client.ttl('mykey')
// -1
```
