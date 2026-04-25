import { runFfprobe } from "./ffmpeg";

type Resolution = [width: number, height: number];
export async function getResolution(input: string): Promise<Resolution> {
  const metadata = await runFfprobe(input);
  const video_stream = metadata.streams.find(
    (stream) => stream.codec_type === "video"
  );

  if (!video_stream?.width || !video_stream.height) {
    throw new Error(`No video stream with dimensions found in ${input}`);
  }

  return [video_stream.width, video_stream.height];
}

export async function getDuration(input: string): Promise<number> {
  const metadata = await runFfprobe(input);
  return Number(metadata.format.duration || 0);
}

export type VideoOrientation = "horizontal" | "vertical";
export async function getVideoOrientation(
  input: URL
): Promise<VideoOrientation> {
  const [width, height] = await getResolution(decodeURI(input.pathname));
  return width >= height ? "horizontal" : "vertical";
}
