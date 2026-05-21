# code-audit

TypeScript code-style auditor. Detects violations that ESLint and Biome don't cover: bucket boundaries, type placement, helper extraction, parameter count, function/file size.

Built on `ts-morph`. Runs on Bun.

## Run

```bash
# audit all TS files under src/
bunx github:MaxBoiko21/code-audit 'src/**/*.ts'

# audit only files changed vs HEAD (working tree + staged + untracked)
bunx github:MaxBoiko21/code-audit --changed

# audit only staged files (good for pre-commit)
bunx github:MaxBoiko21/code-audit --changed=staged

# audit current branch vs main (good for pre-PR)
bunx github:MaxBoiko21/code-audit --changed=main

# JSON output, specific rules only
bunx github:MaxBoiko21/code-audit --json --rules=R7-params,R12-block-bodies src/
```

Exit code `1` if any error-severity violation. Warnings don't fail the run.

## Local dev

```bash
git clone https://github.com/MaxBoiko21/code-audit
cd code-audit
bun install
bun run src/cli.ts 'src/**/*.ts'
```

## Rules

| Rule | Severity | What it catches |
|------|----------|----|
| `R1-nesting` | warn | Nesting depth > 2 inside a function. `else` after a then-branch that returns. |
| `R3-function-size` | warn @31–50, **error** @51+ | Executable lines per function. |
| `R4-file-size` | warn @151–200 lines or > 4 cognitive units, **error** @201+ lines | Executable lines and top-level function/method count. |
| `R7-params` | warn | Function with 4+ parameters. |
| `R9-types` | **error** for `any` and `as unknown as X`, warn for missing return type on exports | Type discipline. |
| `R12-block-bodies` | warn | `if`/`else`/`for`/`while`/`do-while` without `{ }`. |
| `TS-enum-interface` | warn | `enum` declarations. `interface` outside of declaration merging. |
| `TS-types-placement` | warn | Inline parameter type with > 3 properties. Nested inline type. Duplicated inline literal. Non-flat local type in a file with runtime code. |
| `TEST-R7-naming` | warn | `describe`/`it`/`test` label not starting with a capitalized feature noun (in `*.test.ts` / `*.spec.ts`). |

Full prose for each rule lives in [code-style.md](https://github.com/MaxBoiko21/dotclaude/blob/main/rules/code-style.md) (link will work after the personal rules repo is published). Until then, see `~/.claude/rules/code-style.md` locally.

## Flags

| Flag | Effect |
|------|--------|
| `--json` | JSON output (otherwise pretty text). |
| `--rules=A,B,C` | Run only the listed rules. |
| `--changed` | Audit working tree + staged + untracked vs HEAD. |
| `--changed=staged` | Only staged files. |
| `--changed=<ref>` | Current branch vs `<ref>` (branch, tag, or commit). |
| `<glob>` (positional) | Explicit file paths or globs. Default `src/**/*.{ts,tsx}`. |

`--changed` overrides any positional paths.

## JSON output schema

```json
{
  "total": 3,
  "errors": 1,
  "warnings": 2,
  "violations": [
    {
      "rule": "R9-types",
      "severity": "error",
      "file": "/abs/path/to/file.ts",
      "line": 12,
      "column": 3,
      "message": "`any` — use `unknown`, a concrete type, or a generic"
    }
  ]
}
```

Stable shape — safe to pipe into other tools.

## Why this exists

ESLint and Biome cover syntax and a fixed set of rules. They don't cover the rules that come from a personal code-style document: function bucket discipline (validate / transform / query / mutate / log / orchestrate), helper extraction with a 3-line cap, type placement by domain folder, flat-local-types invariant. This tool encodes those rules as AST checks so the style document and the linter agree.

## Status

v0.1 — 9 rules, dogfood-clean. Open for additions.
