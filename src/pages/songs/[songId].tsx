import { useRouter } from "next/router";
import Error from "next/error";
import { trpc } from "../../utils/trpc";

function SingleSongPage() {
  const router = useRouter();
  const songId = router.query.songId as string;

  const { data, isLoading } = trpc.song.singleSong.useQuery({ songId });

  if (isLoading) {
    return <p>Loading songs...</p>;
  }

  if (!data) {
    return <Error statusCode={404} />;
  }

  return (
    <div>
      <h1>{data.title}</h1>
      <p>{data.body}</p>
    </div>
  );
}

export default SingleSongPage;
