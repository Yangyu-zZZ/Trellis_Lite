import chalk from "chalk";
import { PACKAGE_NAME } from "../constants/version.js";

export interface UpgradeOptions {
  dryRun?: boolean;
  tag?: string;
}

/** Print the update command for the installed Lite package or source checkout. */
export async function upgrade(options: UpgradeOptions = {}): Promise<void> {
  if (/^@[^/]+\/trellis-lite$/.test(PACKAGE_NAME)) {
    console.log(chalk.cyan("Update your installed Trellis Lite package:"));
    console.log(
      `  npm install --global ${PACKAGE_NAME}@${options.tag ?? "latest"}`,
    );
    console.log("Then run trellis update in each target project.");
    return;
  }
  console.log(chalk.cyan("Update Trellis Lite from your source checkout:"));
  console.log("https://github.com/Yangyu-zZZ/Trellis_Lite");
  console.log("  git pull --ff-only");
  console.log("  pnpm install --frozen-lockfile");
  console.log("  pnpm build");
  console.log(
    "Then run the rebuilt Lite CLI's update command in each target project.",
  );
}
