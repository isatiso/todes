> - **Redis官方文档**：https://redis.io/commands/setrange
> - **起始版本**：2.2.0
> - **时间复杂度**：O(1)

返回指定 key 的 string 长度，如果 key 存储的值不是 string 类型，则会抛出异常。

- key 不存在返回 0。

例子：

```typescript
await client.set('mykey', 'Hello World')
// "OK"
await client.strlen('mykey')
// 11
await client.strlen('nonexisting')
// 0
```
