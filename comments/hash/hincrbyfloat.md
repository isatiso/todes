> - **Redis官方文档**：https://redis.io/commands/hincrby
> - **起始版本**：2.6.0
> - **时间复杂度**：O(1)

对指定的 hash 中的 field 对应的值进行**浮点数**自增操作，返回自增之后的值。

- 如果 key 不存在，会先创建一个新的包含 hash。
- 如果 field 不存在，则在执行操作前 field 的值会被设置为 0。
- 如果 key 对应的类型不是 hash，或者 field 对应的值不能解析为数字，则抛出异常。
- 当 increment 参数传入一个负数时，相当于执行了自减操作。
- increment 支持指数表示法，见 [[RedisStringClient.incrbyfloat | INCRBYFLOAT]] 命令。

例子：

```typescript
await client.hset('mykey', { field: '10.50' })
// 1
await client.hincrbyfloat('mykey', 'field', '0.1')
// "10.6"
await client.hincrbyfloat('mykey', 'field', '-5')
// "5.6"
await client.hset('mykey', { field: '5.0e3' })
// 0
await client.hincrbyfloat('mykey', 'field', '2.0e2')
// "5200"
```
