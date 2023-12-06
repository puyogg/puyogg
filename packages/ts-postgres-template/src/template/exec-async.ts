import { spawn } from 'node:child_process';

export const execAsync = async (
  cmd: string,
  args: string[],
  { cwd }: { cwd?: string },
): Promise<number> => {
  const exec = spawn(cmd, args, { stdio: 'inherit', cwd });

  return new Promise<number>((res, rej) => {
    exec.on('error', (err) => rej(err));
    exec.on('exit', (code, signal) => {
      if (typeof code === 'number' && code > 0) {
        return rej(new Error(`Process exited with code: ${code}`));
      }

      if (signal) {
        return rej(new Error(`Process terminated due to signal: ${signal}`));
      }

      if (code === null) {
        return rej(new Error(`Null exit code`));
      }

      res(code);
    });
  });
};
