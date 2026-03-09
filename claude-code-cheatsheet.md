# Claude Code Workflow Cheatsheet — Definitive Edition 2026

> Verified against official Anthropic documentation at [code.claude.com](https://code.claude.com) — March 2026

---

## 1. Installation

```bash
# Native installer (recommended) — no Node.js needed, auto-updates
curl -fsSL https://claude.ai/install.sh | bash

# macOS Homebrew (manual updates)
brew install --cask claude-code

# Windows PowerShell
irm https://claude.ai/install.ps1 | iex

# Windows WinGet
winget install Anthropic.ClaudeCode

# npm (deprecated — use native installer instead)
npm install -g @anthropic-ai/claude-code
```

**Requirements:** macOS 13+, Windows 10+, Ubuntu 20.04+, 4GB+ RAM

```bash
cd your-project
claude        # Start Claude Code
/init         # Generate starter CLAUDE.md
```

---

## 2. Understanding CLAUDE.md

**CLAUDE.md** = Claude's persistent memory about your project.
Loaded automatically at the start of every session.

| WHAT              | WHY                    | HOW                         |
|-------------------|------------------------|-----------------------------|
| Tech stack        | Purpose of each module | Build/test/lint commands     |
| Directory map     | Design decisions       | Workflows & conventions     |
| Architecture      | Constraints            | Code style & patterns       |

### Example

```markdown
# Project: MyApp
FastAPI REST API + React SPA + Postgres

## Commands
npm run dev / npm run test / npm run lint

## Architecture
/app → Next.js App Router pages
/lib → shared utilities
/prisma → DB schema & migrations

## Conventions
- Use 2-space indentation
- All API endpoints require auth middleware
- Tests use AAA pattern (Arrange, Act, Assert)
```

### Best Practices

- Run `/init` first, then refine output
- Be specific in instructions — "Use 2-space indentation" not "format nicely"
- Add gotchas Claude cannot infer from code
- Reference docs with `@filename`
- Add workflow rules
- Keep memory concise — every line costs context
- Commit to Git for team sharing
- Use `.claude/rules/` for file-scoped rules (glob patterns)
- Keep each file under 200 lines

---

## 3. Memory File Hierarchy

```
~/.claude/CLAUDE.md              ← Global — all projects (personal)
/CLAUDE.md                       ← Project root — shared on git
./frontend/CLAUDE.md             ← Subfolder — scoped content (lazy-loaded)
CLAUDE.local.md                  ← Personal overrides — gitignored
~/.claude/projects/<project>/memory/  ← Auto-memory — Claude writes for itself
```

**Managed policy** (organization-wide, read-only):
- macOS: `/Library/Application Support/ClaudeCode/CLAUDE.md`
- Linux: `/etc/claude-code/CLAUDE.md`

### Conflict Resolution

- **More specific levels WIN** on conflicts
- Subfolder CLAUDE.md overrides project root
- Local overrides shared
- Managed policy cannot be overridden
- Ancestors load at startup; descendants lazy-load when accessed

---

## 4. Project File Structure

```
your-project/
├── CLAUDE.md                    ← Project memory (committed)
├── CLAUDE.local.md              ← Personal overrides (gitignored)
├── .claude/
│   ├── settings.json            ← Shared project settings (committed)
│   ├── settings.local.json      ← Personal settings (gitignored)
│   ├── skills/                  ← Skills (replaces old commands/)
│   │   ├── code-review/
│   │   │   └── SKILL.md
│   │   └── testing/
│   │       └── SKILL.md
│   ├── agents/                  ← Custom subagents
│   │   └── security-reviewer.md
│   └── rules/                   ← File-scoped rules
│       └── typescript.md
├── .mcp.json                    ← MCP server config (committed)
├── .gitignore
└── src/
```

---

## 5. The 5-Layer Architecture

| Layer | Component     | Purpose                              |
|-------|---------------|--------------------------------------|
| L1    | **CLAUDE.md** | Persistent context and rules         |
| L2    | **Skills**    | On-demand knowledge packs            |
| L3    | **MCP**       | External service connections          |
| L4    | **Hooks**     | Deterministic automation callbacks    |
| L5    | **Agents**    | Isolated context subagents           |

---

## 6. Adding Skills (The Superpower)

**Skills** = markdown guides Claude auto-invokes via natural language.

| Scope            | Location                              |
|------------------|---------------------------------------|
| Project skill    | `.claude/skills/<name>/SKILL.md`      |
| Personal skill   | `~/.claude/skills/<name>/SKILL.md`    |

### SKILL.md Format

```markdown
name: testing-patterns
description: Jest testing patterns for React components
allowed-tools: Read, Grep, Glob

# Testing Patterns

Use describe + it + AAA pattern
Use factory mocks for external dependencies
Always test error paths
```

**Critical:** The `description` field drives auto-activation — make it specific and descriptive. Descriptions load at startup; full content loads on invoke.

Use `context: fork` to run in isolated subagent.

### Skill Ideas for AI Engineers

`code-review` | `testing-patterns` | `commit-messages` | `docker-deploy` | `codebase-visualizer` | `api-design` | `security-audit` | `db-migrations`

---

## 7. MCP (Model Context Protocol)

MCP connects Claude Code to external tools, databases, and APIs.

### Configuration

```bash
# Add HTTP server (recommended for remote)
claude mcp add --transport http serverName https://api.example.com/mcp

# Add stdio server (local processes)
claude mcp add --transport stdio serverName -- npx package-name

# Add with auth
claude mcp add --transport http --header "Authorization: Bearer TOKEN" serverName URL

# List servers
claude mcp list
```

### Config Locations (highest to lowest priority)

| Scope   | Location                          | Purpose             |
|---------|-----------------------------------|---------------------|
| Local   | `.claude/settings.local.json`     | Personal, this project |
| Project | `.mcp.json`                       | Team-shared          |
| User    | `~/.claude.json`                  | Personal, all projects |
| Managed | System-level config               | Organization-wide    |

### Permission Rules for MCP Tools

```
mcp__servername__toolname    ← Specific tool
mcp__servername__*           ← All tools from server
```

---

## 8. Setting Up Hooks

**Hooks** = deterministic callbacks (not LLM-dependent).

### All Hook Events

| Event                | Blockable | Description                        |
|----------------------|-----------|------------------------------------|
| `SessionStart`       | No        | Session starts or resumes          |
| `InstructionsLoaded` | No        | CLAUDE.md loaded                   |
| `UserPromptSubmit`   | Yes       | User submits a prompt              |
| `PreToolUse`         | Yes       | Before any tool execution          |
| `PostToolUse`        | No        | After successful tool execution    |
| `PostToolUseFailure` | No        | After tool failure                 |
| `PermissionRequest`  | Yes       | When user permission is needed     |
| `Notification`       | No        | For user notifications             |
| `SubagentStart`      | No        | Subagent begins                    |
| `SubagentStop`       | Yes       | Subagent completes                 |
| `Stop`               | Yes       | Session stops                      |
| `PreCompact`         | No        | Before conversation compaction     |
| `ConfigChange`       | Yes       | Configuration changes              |
| `TeammateIdle`       | Yes       | Agent team member goes idle        |
| `TaskCompleted`      | Yes       | Task marked complete               |
| `WorktreeCreate`     | No        | Git worktree created               |
| `WorktreeRemove`     | No        | Git worktree removed               |

### Hook Types

| Type        | Description                          |
|-------------|--------------------------------------|
| `command`   | Execute shell script (JSON on stdin) |
| `http`      | POST to HTTP endpoint                |
| `prompt`    | LLM prompt for decisions             |
| `agent`     | Delegate to an agent                 |

### Configuration Example

```json
{
  "hooks": {
    "PreToolUse": [{
      "matcher": "Bash",
      "hooks": [{
        "type": "command",
        "command": "./scripts/validate.sh",
        "timeout": 10
      }]
    }]
  }
}
```

### Exit Codes

- `0` → allow (approve action)
- `2` → block (deny action, blockable events only)

---

## 9. Permissions & Safety

### Permission Modes

| Mode                  | Behavior                                          |
|-----------------------|---------------------------------------------------|
| `default`             | Standard — prompts for permission on first use    |
| `acceptEdits`         | Auto-accepts file edit permissions for session     |
| `plan`                | Read-only — can analyze but not modify             |
| `dontAsk`             | Auto-denies tools unless pre-approved              |
| `bypassPermissions`   | Skips ALL checks (isolated environments only)      |

### Permission Rules

```json
{
  "permissions": {
    "allow": ["Bash(npm run lint:*)", "Read(./docs)"],
    "ask":   ["Bash(git push *)"],
    "deny":  ["Read(.env)", "Bash(rm -rf *)"]
  }
}
```

### Evaluation Order

**deny** → **ask** → **allow** (first matching rule wins)

### Settings Precedence (highest to lowest)

1. **Managed settings** (organization, read-only)
2. **Command-line flags** (`--allowedTools`, `--model`)
3. **Local project** (`.claude/settings.local.json`)
4. **Shared project** (`.claude/settings.json`)
5. **User** (`~/.claude/settings.json`)

---

## 10. Custom Agents / Subagents

Agents are markdown files with YAML frontmatter in `.claude/agents/`.

### Agent Definition

```markdown
---
name: code-reviewer
description: Reviews code for quality and security
tools: Read, Glob, Grep, Bash
model: sonnet
---

You are a senior code reviewer. When invoked:
1. Run git diff to see recent changes
2. Focus on modified files
3. Review for clarity, security, and correctness
```

### Frontmatter Fields

| Field             | Required | Description                                  |
|-------------------|----------|----------------------------------------------|
| `name`            | Yes      | Unique identifier (lowercase, hyphens)       |
| `description`     | Yes      | When Claude should invoke this agent          |
| `tools`           | No       | Available tools (default: all)               |
| `disallowedTools` | No       | Tools to deny                                |
| `model`           | No       | `sonnet`, `opus`, `haiku`, `inherit`         |
| `permissionMode`  | No       | Permission mode for agent                    |
| `maxTurns`        | No       | Maximum agentic turns                        |
| `skills`          | No       | Skills to inject                             |
| `mcpServers`      | No       | MCP servers available                        |
| `hooks`           | No       | Agent-specific hooks                         |
| `memory`          | No       | `user`, `project`, or `local`                |
| `background`      | No       | Run as background task                       |
| `isolation`       | No       | `worktree` for isolated copy                 |

### Agent Locations

| Location              | Scope                   |
|-----------------------|-------------------------|
| `.claude/agents/`     | Project (shared, in git)|
| `~/.claude/agents/`   | User (all projects)     |

---

## 11. Daily Workflow Pattern

```
cd project && claude
Shift+Tab → Plan Mode           Read-only first
Describe feature intent
Shift+Tab → Auto Accept         When ready to edit
/compact                        Compress proactively
Esc Esc → /rewind               Undo mistakes
Commit frequently
Start new session per feature
```

### Context Management Tips

- Use `/context` to visualize context usage as a colored grid
- Use `/cost` to check token usage
- Delegate verbose tasks to subagents (they manage their own context)
- Move large instructions to `.claude/rules/` (loaded on-demand)
- Move task-specific guides to skills (loaded only when relevant)
- Start fresh sessions for new features — don't reuse stale context

---

## 12. Quick Reference

### Slash Commands (Essential)

| Command         | Purpose                                      |
|-----------------|----------------------------------------------|
| `/init`         | Generate CLAUDE.md                           |
| `/compact`      | Compress context                             |
| `/memory`       | Edit memory files & auto-memory              |
| `/permissions`  | View/update permissions                      |
| `/agents`       | Manage subagents                             |
| `/skills`       | List available skills                        |
| `/doctor`       | Environment diagnostics                      |
| `/review`       | Code review a PR                             |
| `/mcp`          | Manage MCP servers                           |
| `/diff`         | Interactive diff viewer                      |
| `/context`      | Visualize context usage                      |
| `/model`        | Change AI model                              |
| `/config`       | Open settings                                |
| `/hooks`        | Manage hook configurations                   |
| `/clear`        | Clear conversation                           |
| `/rewind`       | Restore to previous point                    |
| `/resume`       | Resume a previous session                    |
| `/export`       | Export conversation as text                  |
| `/cost`         | Token usage statistics                       |
| `/fast`         | Toggle fast mode                             |
| `/plan`         | Enter plan mode                              |
| `/theme`        | Change color theme                           |
| `/vim`          | Toggle vim editing mode                      |
| `/keybindings`  | Customize keyboard shortcuts                 |
| `/login`        | Sign in                                      |
| `/logout`       | Sign out                                     |
| `/feedback`     | Submit feedback / bug report                 |

### Keyboard Shortcuts

| Shortcut         | Action                                   |
|------------------|------------------------------------------|
| `Shift+Tab`      | Cycle permission modes                   |
| `Esc Esc`        | Rewind menu                              |
| `Tab`            | Toggle extended thinking                 |
| `Ctrl+C`         | Cancel current operation                 |
| `Ctrl+D`         | Exit Claude Code                         |
| `Ctrl+L`         | Clear terminal screen                    |
| `Ctrl+O`         | Toggle verbose output                    |
| `Ctrl+R`         | Reverse search history                   |
| `Ctrl+G`         | Open external editor                     |
| `Ctrl+T`         | Toggle task list                         |
| `Ctrl+B`         | Background running tasks                 |
| `Ctrl+F`         | Kill all background agents               |
| `Alt+P`          | Switch model                             |
| `Alt+T`          | Toggle extended thinking                 |
| `\ + Enter`      | Multiline input (all terminals)          |

### Special Prefixes

| Prefix | Purpose                    | Example           |
|--------|----------------------------|-------------------|
| `@`    | File/folder autocomplete   | `@src/index.ts`   |
| `!`    | Direct bash (no tokens)    | `! npm test`      |
| `#`    | Quick memory note          | `# use pnpm`      |
| `/`    | Slash command or skill     | `/compact`         |

---

## 13. Tools Available to Claude Code

| Tool              | Purpose                                    |
|-------------------|--------------------------------------------|
| `Bash`            | Execute shell commands                     |
| `Read`            | Read files, images, PDFs, notebooks        |
| `Edit`            | Exact string replacements in files         |
| `Write`           | Create or overwrite files                  |
| `Glob`            | Fast file pattern matching                 |
| `Grep`            | Search file contents with regex            |
| `Agent`           | Launch specialized subagents               |
| `WebFetch`        | Fetch and process web content              |
| `WebSearch`       | Search the web                             |
| `NotebookEdit`    | Edit Jupyter notebook cells                |
| `TodoWrite`       | Create/manage task lists                   |
| `AskUserQuestion` | Ask user for input/decisions               |
| `Skill`           | Invoke registered skills                   |
| `mcp__*`          | MCP server tools (configured per project)  |

---

## 14. Multi-File Editing Workflow

1. **Plan first** — Use `Shift+Tab` to enter Plan Mode before editing
2. **Read before edit** — Always read a file before modifying it
3. **Use subagents for parallel edits** — `Agent` tool with `isolation: worktree`
4. **Prefer `Edit` over `Write`** — Edit sends only the diff, Write replaces entire file
5. **Use `@filename` references** — Attach files to your prompt for context
6. **`/diff` to review** — Check all changes before committing
7. **Commit atomically** — One logical change per commit

---

## 15. Testing Strategies

- **Use Skills** for testing patterns — create `.claude/skills/testing/SKILL.md`
- **AAA Pattern** — Arrange, Act, Assert in every test
- **Use hooks for CI** — `PreToolUse` hook to validate before execution
- **Factory mocks** — Prefer factory functions over inline mocks
- **Test error paths** — Not just happy paths
- **Run tests via allowed permissions** — `"allow": ["Bash(npm run test*)"]`

---

*Verified against [code.claude.com](https://code.claude.com) documentation — March 2026*
*Source: Anthropic official documentation*
