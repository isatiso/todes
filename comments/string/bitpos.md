> - **Redis官方文档**：https://redis.io/commands/bitpos
> - **起始版本**：2.8.7
> - **时间复杂度**：O(N)

将字符串视为一个 bit 数组，寻找其中第一个被设置为目标 bit 的位置，返回下标。

如果给定范围没有找到目标 bit，则返回 -1。

**注意**：

- 这里的 start 和 end 表示的是 **byte** 位置，而不是 **bit** 位置，但是返回值表示的是 **bit** 位置。
- start 的值只是决定了**开始寻找的位置**，返回的 bit 位置都是**从整个字符串的首位**开始计算。

例子：

```typescript
await client.set('mykey', Buffer.from([0xff, 0xf0, 0x00])).then(console.log)
// "OK"
await client.bitpos('mykey', 0).then(console.log)
// 12
await client.set('mykey', Buffer.from([0x00, 0xff, 0xf0])).then(console.log)
// "OK"
await client.bitpos('mykey', 1, 0).then(console.log)
// 8
await client.bitpos('mykey', 1, 2).then(console.log)
// 16
await client.set('mykey', Buffer.from([0x00, 0x00, 0x00])).then(console.log)
// "OK"
await client.bitpos('mykey', 1).then(console.log)
// -1
```
