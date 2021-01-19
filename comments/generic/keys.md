> - **起始版本：**1.0.0
> - **时间复杂度：**O(N)，N 为当前库中 key 的个数。

返回匹配 pattern 的全部 key 的列表。

**警告：** 这是一个方便调试的命令，当你对一个庞大的库使用这个命令时，会导致性能及其底下。

支持的 glob 风格 patterns:
- `h?llo` 匹配 `hello`, `hallo` 和 `hxllo`。
- `h*llo` 匹配 `hllo` 和 `heeeello`。
- `h[ae]llo` 匹配 `hello`，`hallo`，但是 `hillo` 不行。
- `h[^e]llo` 匹配 `hallo`， `hbllo`，但是 `hello` 不行。
- `h[a-b]llo` 匹配 `hallo` 和 `hbllo`。
