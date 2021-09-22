---
title: "Debug Symbols"
metaTitle: "Reference | Admin | Debug Symbols"
metaDescription: "Check for debug symbols."
order: 7
---

Pixie automatically traces requests of a variety of protocol types. A subset of the supported protocols and encryption libraries require debug and/or DWARF symbols to work with Pixie.

## Checking for debug symbols

You can verify that an executable has debug symbols using `nm`:

```bash
nm <executable>
```

An output of `no symbols` means the application has no debug symbols and won't be traced.

## Checking for DWARF symbols

You can verify that an executable has DWARF symbols using `dwarfdump` or `llvm-dwarfdump`:

```bash
dwarfdump <executable>

```

An output of `No DWARF information present` means the application has no DWARF symbols, and won't be traced.

## Adding symbols to your Golang executable

By default, `go build` compiles your program with debug and DWARF symbols. However, if you compile with `-ldflags`, make sure to remove the `'-s'` and `'-w'`.
