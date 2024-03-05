import CombinedAuthForm from "../components/CombinedAuthForm";
import "../app/globals.css"
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>Register & Login</title>
      </Head>
      <div>
        <CombinedAuthForm />
      </div>
    </>
  );
}