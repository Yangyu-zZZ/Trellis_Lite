import fs from "node:fs";

const HOOK_CONFIGS = new Set([
  ".claude/settings.json",
  ".cursor/hooks.json",
  ".codex/hooks.json",
  ".codebuddy/settings.json",
  ".factory/settings.json",
  ".zcode/config.json",
]);
const RETIRED_HOOK = /(?:^|[\\/])inject-subagent-context\.py(?:["'\s]|$)/;

/** Remove only the retired Trellis registration, preserving unrelated hooks/settings. */
export function retireLiteConfig(
  relativePath: string,
  content: string,
): string {
  if (HOOK_CONFIGS.has(relativePath)) {
    try {
      const parsed: unknown = JSON.parse(content);
      let removed = false;
      function clean(value: unknown): unknown {
        if (Array.isArray(value))
          return value.map(clean).filter((v) => v !== undefined);
        if (value === null || typeof value !== "object") return value;
        const obj = value as Record<string, unknown>;
        if (typeof obj.command === "string" && RETIRED_HOOK.test(obj.command)) {
          removed = true;
          return undefined;
        }
        const result = Object.fromEntries(
          Object.entries(obj).map(([k, v]) => [k, clean(v)]),
        );
        if (
          Array.isArray(result.hooks) &&
          result.hooks.length === 0 &&
          Array.isArray(obj.hooks) &&
          obj.hooks.length > 0
        )
          return undefined;
        return result;
      }
      const cleaned = clean(parsed);
      return removed && cleaned !== undefined
        ? `${JSON.stringify(cleaned, null, 2)}\n`
        : content;
    } catch {
      return content;
    }
  }
  if (
    relativePath === ".codex/config.toml" &&
    content.includes("# Pin the subagent recursion depth explicitly")
  ) {
    const withoutComment = content.replace(
      /^# Pin the subagent recursion depth explicitly[^]*?(?=^\[agents\])/m,
      "",
    );
    return withoutComment.replace(
      /(^\[agents\]\s*\r?\n)([\s\S]*?)(?=^\[|$(?![^]))/gm,
      (_all: string, header: string, body: string) => {
        const cleaned = body.replace(
          /^max_depth\s*=\s*1\s*(?:#[^\r\n]*)?\r?\n/gm,
          "",
        );
        return cleaned.trim() ? header + cleaned : "";
      },
    );
  }
  return content;
}

/** Read-only preparation: normal update backups and dry-run rules still apply. */
export function liteConfigCleanup(
  relativePath: string,
  fullPath: string,
): string | null {
  const existing = fs.readFileSync(fullPath, "utf-8");
  const cleaned = retireLiteConfig(relativePath, existing);
  return cleaned === existing ? null : cleaned;
}
