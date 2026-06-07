import { RequestInfo } from "rwsdk/worker";
import { VideoCard } from "../components/video-card";

export async function Home({ ctx }: RequestInfo) {
  const videos = await ctx.db.video.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      playlistUrl: {
        not: null,
      },
    },
  });

  return (
    <>
      <title>Videos - StreamGeek</title>
      <meta
        name="description"
        content="Run your own video streaming app on the cheap! 🚀🤓"
      />
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </div>
    </>
  );
}
