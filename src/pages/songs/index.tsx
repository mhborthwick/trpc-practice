import Link from "next/link";
import { trpc } from "../../utils/trpc";

function SongListingPage() {
  const { data, isLoading } = trpc.song.songs.useQuery();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      {data?.map((song) => {
        return (
          <article key={song.id}>
            <p>{song.title}</p>
            <Link href={`/songs/${song.id}`}>See song</Link>
          </article>
        );
      })}
    </div>
  );
}

export default SongListingPage;
