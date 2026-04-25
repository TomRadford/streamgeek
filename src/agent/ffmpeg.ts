import { execa, type Options } from "execa";

export type FfprobeMetadata = {
  streams: Array<{
    codec_type?: string;
    width?: number;
    height?: number;
  }>;
  format: {
    duration?: string;
  };
};

function formatCommand(command: string, args: string[]) {
  return [command, ...args].join(" ");
}

function logProcessError(label: string, error: unknown) {
  console.error(`${label} error`);
  console.error(error);

  if (error && typeof error === "object" && "stderr" in error) {
    const stderr = (error as { stderr?: string }).stderr;
    if (stderr) {
      console.error(stderr);
    }
  }
}

export async function runFfmpeg(
  args: string[],
  options?: Options
): Promise<void> {
  console.log(formatCommand("ffmpeg", args));
  await execa("ffmpeg", args, {
    stdout: "inherit",
    stderr: "inherit",
    ...options,
  });
}

export async function runFfprobe(input: string): Promise<FfprobeMetadata> {
  const { stdout } = await execa("ffprobe", [
    "-v",
    "error",
    "-print_format",
    "json",
    "-show_streams",
    "-show_format",
    input,
  ]);

  return JSON.parse(stdout) as FfprobeMetadata;
}

export { logProcessError };
