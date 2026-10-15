# Trellis Lite

[English](README.md) · [官方 Trellis](https://github.com/mindfold-ai/Trellis)

供个人使用的 Trellis 精简版：**讨论需求 → 生成 PRD → 主会话直接实现 → 记录进度**。通过项目文件在不同工具之间延续上下文。

## 保留与移除

| 保留                           | 从默认流程移除                          |
| ------------------------------ | --------------------------------------- |
| 需求讨论、PRD 生成与更新       | Research / Implement / Check 专职子代理 |
| 官方全部 22 个平台适配器       | 专用 `trellis-check` 技能               |
| 项目规范、按需读取上下文       | 强制检查、自修复阶段                    |
| 任务、父子任务、日志与会话隔离 | 子代理上下文注入、角色 JSONL 必填门槛   |
| 同一项目同时配置多个工具       | Codex 子代理递归深度限制                |

大模型在主会话内自行选择调研、实现和验证方式。普通测试、lint、调试及自定义技能照常可用；`design.md`、`implement.md`、调研笔记按需添加。

完整保留的平台：Claude Code、Cursor、OpenCode、Codex、Kilo CLI、Kiro、Gemini CLI、Antigravity、Devin、Qoder、CodeBuddy、GitHub Copilot、Factory Droid、DeepSeek Harness、Pi、Reasonix、ZCode、Trae、Oh My Pi、Grok Build、Kimi Code、Snow CLI。各平台原有命令、技能、钩子和扩展格式继续保留。Kiro 的 `trellis` 主入口也保留。

`mem`、卸载等独立工具继续可用。Channel 仅在用户明确要求时使用，不再提供默认角色卡，也不会在默认流程中自动派发任务。主动选择外部 `trellis workflow` 模板会替换当前 Lite 工作流。

## npm 安装

Lite 发布包为 `@yangyu666/trellis-lite`。需要 Node.js >=18.17、Python >=3.9 和 Git。

```bash
npm install --global @yangyu666/trellis-lite
trellis init --claude --codex --cursor
```

也可以免全局安装：

```bash
npx @yangyu666/trellis-lite init --claude --codex --cursor
```

后续使用同一个包名更新，再在目标项目运行 `trellis update`。如果已经全局安装官方版，两者提供的 `trellis` / `tl` 命令相同，应先卸载官方版再安装 Lite。

## 从源码构建

需要 Node.js >=18.17、Python >=3.9、Git 和 pnpm 10.32.1。官方 `@mindfoldhq/trellis` 包仍是官方工作流；Lite 使用单独的包名。

```bash
git clone https://github.com/Yangyu-zZZ/Trellis_Lite.git
cd Trellis_Lite
corepack enable
pnpm install --frozen-lockfile
pnpm build
```

没有 Corepack 时，可用 `npx --yes pnpm@10.32.1` 替代命令中的 `pnpm`。

在目标项目根目录执行，可以同时选择多个平台：

```bash
node /absolute/path/Trellis_Lite/packages/cli/bin/trellis.js init --claude --codex --cursor
```

Windows PowerShell 示例：

```powershell
$TrellisLite = 'D:\MyTrellis\packages\cli\bin\trellis.js'
Set-Location 'D:\YourProject'
node $TrellisLite init --claude --codex --cursor
```

在所用工具内调用 `trellis-continue` 对应的命令或技能，讨论需求并写入 `.trellis/tasks/<task>/prd.md`，之后在主会话直接实现。命令的具体写法沿用各平台格式。没有启动钩子的平台使用 `trellis-start`。

切换工具时，在新会话执行 `task.py start <task>` 激活同一任务，再读取 PRD、已保存的决定与进度。无法自动获取终端会话标识的平台，可以为当前会话设置固定的 `TRELLIS_CONTEXT_ID`；同时工作的不同会话应使用不同标识。

## 已有项目升级

先在本仓库执行 `git pull --ff-only`、安装依赖并重新构建。然后在目标项目中运行本仓库构建的 CLI：

```bash
node /absolute/path/Trellis_Lite/packages/cli/bin/trellis.js update --dry-run
node /absolute/path/Trellis_Lite/packages/cli/bin/trellis.js update
```

0.6.18 迁移会清理内容可识别且未修改的旧角色、检查技能和注入文件；用户修改过的文件会保留并提示人工处理。已识别 JSON 配置中的旧注入钩子会被移除，其他设置保留。官方模板写入的 Codex 深度限制会被移除，自定义深度值保留。任务、规范和日志属于受保护数据。旧 JSONL 文件仍可由兼容命令读取，但不再阻止启动任务。

升级时处理已修改工作流、技能的冲突，才能采用新的 Lite 流程。`update.skip` 排除规则继续有效，被排除的配置可能仍保留旧行为。`trellis upgrade` 显示当前 Lite 包或源码的升级方法。

## 发布自己的 npm 包

源码工作区保留官方内部包名以兼容现有导入，并标为 `private`。发布脚本会生成独立命名的 CLI 与核心包；CLI 通过精确版本的 npm 别名依赖 Lite 核心包。

```bash
pnpm build
node packages/cli/scripts/pack-lite.js --scope yangyu666
npm login --registry https://registry.npmjs.org
npm publish artifacts/npm/yangyu666-trellis-lite-core-0.6.18.tgz --access public
npm publish artifacts/npm/yangyu666-trellis-lite-0.6.18.tgz --access public
```

每次发布先确认包名与版本，并先发布核心包。发布结果清单在 `artifacts/npm/release.json`；相同包名与版本不能覆盖。GitHub Actions 的手动 **Publish Trellis Lite to npm** 工作流也支持相同步骤，需要提供 npm 命名空间及仓库的 `NPM_TOKEN` secret。

## 开发验证

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

回归测试覆盖全部 22 个适配器、Python 命令转换、旧 JSONL 任务启动和升级时保留自定义内容。模板 Python 脚本与仓库 `.trellis/scripts/` 内的副本必须保持字节一致。

基于官方 Trellis 0.6.17，保留原作者署名与 AGPL-3.0-only 许可证，见 [LICENSE](LICENSE)。
