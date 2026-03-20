import { exec } from 'child_process';
import chalk from 'chalk';
import ora from 'ora';

const spinner = ora(chalk.magenta('Linting code...')).start();
spinner.color = 'magenta';

// Adjust the ESLint command and glob pattern as needed for your project.
exec('npx eslint . --fix', (error, stdout, stderr) => {
  // Clear the spinner line before outputting the final message.
  process.stdout.write('\r\x1b[K');

  if (error) {
    spinner.fail(chalk.bgRed(`ESLint error: ${stderr || stdout}`));
    process.exit(1);
  } else {
    spinner.succeed(chalk.magentaBright('Code linted successfully!'));
  }
});
