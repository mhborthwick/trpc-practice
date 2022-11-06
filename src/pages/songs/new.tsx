import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { CreatePostInput } from "../../schema/post.schema";
import { trpc } from "../../utils/trpc";

function CreateSongPage() {
  const { handleSubmit, register } = useForm<CreatePostInput>();
  const router = useRouter();
  const { mutate, error } = trpc.song.addSong.useMutation({
    onSuccess: ({ id }) => {
      router.push(`/songs/${id}`);
    },
  });

  function onSubmit(values: CreatePostInput) {
    mutate(values);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {error && error.message}
      <h1>Add songs</h1>
      <input type="text" placeholder="Your song title" {...register("title")} />
      <br />
      <textarea placeholder="Your song title" {...register("body")} />
      <br />
      <button>Add song</button>
    </form>
  );
}

export default CreateSongPage;
