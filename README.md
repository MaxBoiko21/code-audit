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
| `R12-block-bodies` | warn | `if`/`else`/`for`/`while`/`do-while` without `{ }`. Biome's `useBlockStatements` covers the same ground — enable it in `biome.json` if Biome already runs on the repo. |
| `TS-enum-interface` | warn | `enum` declarations. `interface` outside of declaration merging — detected per-file (`declare module`) and cross-file (same name in 2+ files). |
| `TS-types-placement` | warn | Inline parameter type with > 3 properties. Nested inline type. Duplicated inline literal. Non-flat local type in a file with runtime code. |
| `TEST-R7-naming` | warn | `describe`/`it`/`test` label not starting with an identifier-like feature anchor (in `*.test.ts` / `*.spec.ts`). Accepts both `Auth login` and `createServer: GET /users`. |

Full prose for each rule lives in [code-style.md](https://github.com/MaxBoiko21/dotclaude/blob/main/rules/code-style.md) (link will work after the personal rules repo is published). Until then, see `~/.claude/rules/code-style.md` locally.

## Flags

| Flag | Effect |
|------|--------|
| `--json` | JSON output (machine-readable, full violation list — severity filter does not apply). |
| `--summary` | Compact summary: totals, by-rule breakdown, top-10 files. |
| `--rules=A,B,C` | Run only the listed rules. |
| `--exclude-rules=A,B` | Skip the listed rules. Cannot be combined with `--rules`. |
| `--severity=error` | Show only errors in pretty/summary output. Exit code unchanged. |
| `--severity=warn` | Show only warnings in pretty/summary output. Exit code unchanged. |
| `--changed` | Audit working tree + staged + untracked vs HEAD. |
| `--changed=staged` | Only staged files. |
| `--changed=<ref>` | Current branch vs `<ref>` (branch, tag, or commit). |
| `<glob>` (positional) | Explicit file paths or globs. Default `src/**/*.{ts,tsx}`. |

`--changed` overrides any positional paths.

### Exemptions

The runner exempts files from rules per path:

- `*.d.ts` — globally excluded by `isSourceTsFile`; the only explicit blanket exclusion. `node_modules/` and `dist/` are not enforced — they're avoided in practice because ts-morph's glob respects `.gitignore` and the default positional glob is `src/**/*.{ts,tsx}`. Passing an explicit `dist/**/*.ts` would audit those files.
- `**/migrations/**`, `**/seeds/**`, `**/__generated__/**`, `*.gen.ts`, `*.generated.ts` — exempt from every rule.
- `*.test.ts` / `*.spec.ts` — only `TEST-R7-naming` runs on test files. The other rules (`R1`, `R3`, `R4`, `R7`, `R9`, `R12`, `TS-*`) gate on `isSourceTsFile`, which already excludes tests. The exemption map exists so that if any of those rules is later widened to cover tests, R3/R4/R7 stay opted out.

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

v0.2 — 9 rules, dogfood-clean. `--summary`, `--severity`, `--exclude-rules` flags. Cross-file declaration merging detection. Per-rule exemption map. Cascade collapsing in pretty output.
