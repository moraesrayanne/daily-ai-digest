# Claude Code — Project Rules

## Git Workflow

- **Never push directly to `main`.**
- For every change requested by the user: create a branch, commit, and open a PR.
- Branch naming: `<type>/<short-description>` (e.g. `feat/skip-summarize-dryrun`, `fix/env-validation`, `chore/update-deps`)
- Types mirror Conventional Commits: `feat`, `fix`, `chore`, `refactor`, `test`, `docs`, `ci`
- Wait for the user to review and merge the PR before moving on.

## Commit Convention

- Follow [Conventional Commits](https://www.conventionalcommits.org/):
  `<type>(<scope>): <short description>`
- Types: `feat`, `fix`, `chore`, `refactor`, `test`, `docs`, `style`, `ci`
- Always written in **English**
- Subject line: imperative mood, no period, max 72 chars
- No verbose body unless the change is non-obvious

Examples:
```
feat(pipeline): add dry-run mode via SKIP_SUMMARIZE flag
fix(env): skip validation when SKIP_SUMMARIZE is true
test(env): add coverage for dry-run env validation
```

## Best Practices

- Apply `/best-practices` skill when relevant (security, compatibility, code quality).
