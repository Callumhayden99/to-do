import Head from 'next/head';
import TodoList from './TodoList.client';

export default function Home() {
  return (
    <div>
      <Head>
        <title>To-Do List App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <TodoList />
    </div>
  );
}
