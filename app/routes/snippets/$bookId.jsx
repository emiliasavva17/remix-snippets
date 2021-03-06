import { useLoaderData, useCatch, json } from "remix";
import connectDb from "~/db/connectDb.server.js";

export async function loader({ params }) {
  const db = await connectDb();
  const snippet = await db.models.Snippet.findById(params.bookId);
  if (!snippet) {
    throw new Response(`Couldn't find a snippet with id ${params.bookId}`, {
      status: 404,
    });
  }
  return json(snippet);
}

export default function BookPage() {
  const snippet = useLoaderData();
  return (
    <div className="bg-red-500">
      <h1 className="text-2xl font-bold mb-4">{snippet.title}</h1>
      <h2>{snippet.language}</h2>
      <h3>{snippet.description}</h3>
      {/* <code>
        <pre>{JSON.stringify(snippet, null, 2)}</pre>
      </code> */}
    </div>
  );
}

export function CatchBoundary() {
  const caught = useCatch();
  return (
    <div>
      <h1>
        {caught.status} {caught.statusText}
      </h1>
      <h2>{caught.data}</h2>
    </div>
  );
}

export function ErrorBoundary({ error }) {
  return (
    <h1 className="text-red-500 font-bold">
      {error.name}: {error.message}
    </h1>
  );
}
