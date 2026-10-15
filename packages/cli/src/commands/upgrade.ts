import chalk from "chalk";

export interface UpgradeOptions {
  dryRun?: boolean;
  tag?: string;
}

/** Lite is installed from this fork; the upstream npm package restores upstream defaults. */
export async function upgrade(_options: UpgradeOptions = {}): Promise<void> {
  console.log(chalk.cyan("Update Trellis Lite from your source checkout:"));
  console.log("https://github.com/Yangyu-zZZ/Trellis_Lite");
  console.log("  git pull --ff-only");
  console.log("  pnpm install --frozen-lockfile");
  console.log("  pnpm build");
  console.log(
    "Then run the rebuilt Lite CLI's update command in each target project.",
  );
}
