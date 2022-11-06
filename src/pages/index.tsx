import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import LoginForm from "../components/LoginForm";
import { useUserContext } from "../context/user.context";
import styles from "../styles/Home.module.css";
import { trpc } from "../utils/trpc";

export default function Home() {
  const user = useUserContext();
  if (!user) {
    return <LoginForm />;
  }
  return (
    <div>
      <Link href="songs/new">Add song</Link>
    </div>
  );
}
