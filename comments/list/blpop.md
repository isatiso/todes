> - **Redis官方文档**：https://redis.io/commands/blpop
> - **起始版本**：2.0.0
> - **时间复杂度**：O(1)

BLPOP 是阻塞版本的 [[RedisListClient.lpop ｜ LPOP]] 命令。

- 当参数中指定的所有 list 都没有元素的时候，它会阻塞连接。
- 当有 list 非空时，它会按照给定的 key 顺序从第一个非空 list 的头部弹出一个元素。
- 当 timeout 被设置为 0 时表示不限时阻塞。
- 超时后会返回 null。

### 非阻塞行为

当 BLPOP 被调用时，如果指定的 key 中至少有一个包含了非空列表，则会从其头部弹出一个元素并返回。

考虑命令：

```typescript
await client.blpop(['list1', 'list2', 'list3'], 0)
```

因为 list2 时这一系列 key 中第一个非空 list 是 list2，BLPOP 会保证返回 list2 的第一个元素。

### 阻塞行为

- 如果没有没有指定的 key 存在，BLPOP 会阻塞连接并等待其他客户端向其中某个 key 执行 [[RedisListClient.lpush | LPUSH]] 或 [[RedisListClient.rpush | RPUSH]]
  命令。
- 一旦新的数据出现在列表中，客户端会结束阻塞，弹出元素并以数组形式返回 key 的名字和元素本身。
- 当 BLPOP 命令引起了客户端阻塞并且设置了非零的阻塞时间，超时后会返回 null。

**注意**：timeout 参数在早期的 redis 版本会被解释为整型，6.0.0 及以上版本会被解释为双精度浮点数。

### 哪一个 key/client/element 会被优先处理？优先级详情

- 如果传递了多个 key，但是至少有一个 key 包含了元素。则返回的 key 是从左向右找到的第一个非空列表，此时不会发生阻塞。 所以对于命令：
```typescript
await client.blpop(['key1', 'key2', 'key3', 'key4'], 0)
```
假设其中 key2 和 key4 是非空的，那么返回的是 key2 和它的第一个元素。

- 如果多个客户端阻塞了相同的 key，优先被处理的客户端是等待时间最长的那个，也就是第一个产生阻塞的客户端。
  一旦这个客户端结束了阻塞，它将不会保留任何优先级，再次阻塞时从 0 开始记录阻塞时间。

- 当客户端同时阻塞多个 key，并且元素同时在多个 key 中可用（因事务或Lua脚本同时向多个列表添加元素）时，
  将使用第一个接受 push 操作的 key 解除客户端的阻塞（假设它有足够的元素，因为可能还有其他在等待这个 key 的客户端）。
  一般每执行一个命令，Redis 都会对所有接收过数据并且至少有一个客户端在阻塞的 key 进行检查。
  这些 key 按照新的元素到达时间顺序排列。对于每个 key，在其清空之前 Redis 按照 FIFO 的顺序处理等待中的客户端。
  当 key 清空或者不再有客户端等待这个 key，Redis 才会开始下一个命令/脚本/事务的处理。

### 在事务（MULTI/EXEC）中运行 BLPOP

BLPOP 可以在 pipeline 中运行（发送多个命令，并且批量读取结果），然而这个命令仅在作为 pipeline 的最后一个命令时才有意义。
在（MULTI/EXEC）事务中使用 BLPOP 一般没什么意义，因为他需要阻塞整个服务器来保证事务原子性的执行，此时其他的客户端也无法执行一个 push 操作。
鉴于这个原因，在（MULTI/EXEC）事务中，当 BLPOP 等待的列表为空时，会直接返回 null。这跟等待超时的效果是一样的。

> *如果你喜欢科幻小说，可以想象一下在（MULTI/EXEC）事务块中，时间以无限的长度流动……*

**注意**：timeout 参数在早期的 redis 版本会被解释为整型，6.0.0 及以上版本会被解释为双精度浮点数。
