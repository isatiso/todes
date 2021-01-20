> - **Redis官方文档**：https://redis.io/commands/ping
> - **起始版本**：1.0.0

如果没有提供参数返回 PONG。否则返回 msg 本身。

例子：

```typescript
await client.ping()
// "PONG"
await client.ping('Hello World!')
// "Hello World!"
```
