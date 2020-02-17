v1.0.1 - February 17, 2020
=================
Fixed bug when one dir's name starts with another dir's name.

For example, `/abc` was mistakenly calculated as the `commonDir` for:

```
/abc/file1
/abcd/file2
```

The correct `commonDir` is `/`.
