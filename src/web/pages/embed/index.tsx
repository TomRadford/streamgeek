import { RequestInfo } from "rwsdk/worker";
import { VideoPlayer } from "../../components/player";

export async function EmbedPage({ ctx, params, response }: RequestInfo) {
  const { id } = params;

  // Set permissive CSP for embed page to allow media from any source
  response.headers.set(
    "Content-Security-Policy",
    `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: *; frame-src 'self' *; connect-src 'self' *; media-src 'self' blob: data: *; object-src 'none';`
  );

  const video = await ctx.db.video.findUnique({
    where: {
      id,
    },
  });
  if (!video) {
    return <div>Video not found</div>;
  }
  return (
    <>
      {video.playlistUrl && (
        <VideoPlayer
          video={video}
          className="rounded-none w-full h-full min-h-screen"
        />
      )}
    </>
  );
}
