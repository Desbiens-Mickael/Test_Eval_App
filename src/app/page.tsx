export default function Home() {
  console.log(process.env.NODE_ENV);
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div>
        <h1 className="text-9xl">Hello world !!</h1>
      </div>
    </main>
  );
}
