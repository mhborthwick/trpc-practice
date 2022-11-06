import type { AppType } from "next/app";
import { UserContextProvider } from "../context/user.context";
import { trpc } from "../utils/trpc";

const MyApp: AppType = ({ Component, pageProps }) => {
  const { data, error, isLoading } = trpc.user.me.useQuery();

  if (isLoading) {
    return <div>Loading user...</div>;
  }

  return (
    <UserContextProvider value={data}>
      <Component {...pageProps} />
    </UserContextProvider>
  );
};

export default trpc.withTRPC(MyApp);
