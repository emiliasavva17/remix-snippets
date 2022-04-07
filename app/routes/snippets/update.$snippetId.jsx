import { Form, json, redirect, useActionData, useLoaderData } from "remix";
import connectDb from "~/db/connectDb.server.js";

export async function loader({ params }) {
  const db = await connectDb();
  const snippet = await db.models.Snippet.findById(params._id);
  if (!snippet) {
    throw new Response(`Couldn't find snippet with id ${params._id}`, {
      status: 404,
    });
  }
  return json(snippet);
}

export const action = async ({ request, params }) => {
  const db = await connectDb();
  const form = await request.formData();

  const title = form.get("title");
  const language = form.get("language");
  const description = form.get("description");
  const img = form.get("img");
  const snippetId = params.bookId;
  console.log("title", title);

  try {
    await db.models.Snippet.findOneAndUpdate(
      { _id: snippetId },
      {
        $set: {
          title: title,
          language: language,
          description: description,
          img: img,
        },
      }
    );

    return redirect(`/`);
  } catch (error) {
    return json(
      { errors: error.errors, values: Object.fromEntries(form) },
      { status: 400 }
    );
  }
};

export default function SnippetUpdate() {
  const actionData = useActionData();
  const snippet = useLoaderData();

  return (
    <div className="text-center m-0">
      <h1 className="text-3xl font-bold my-5">Edit existing snippet</h1>
      <Form method="post">
        <label htmlFor="title" className="block font-bold">
          Title
        </label>
        <input
          type="text"
          name="title"
          defaultValue={actionData?.values.title ?? snippet.title}
          id="title"
          className={`p-2 rounded-md w-80 ${
            actionData?.errors.title ? "border-2 border-red-500" : null
          }
          `}
        />
        {actionData?.errors.title && (
          <p className="text-red-500">{actionData.errors.title.message}</p>
        )}

        <label htmlFor="language" className="block mt-3 font-bold">
          Language
        </label>
        <input
          type="text"
          name="language"
          defaultValue={actionData?.values.language ?? snippet.language}
          id="language"
          className={`p-2 rounded-md w-80 ${
            actionData?.errors.language ? "border-2 border-red-500" : null
          }
          `}
        />
        <label htmlFor="description" className="block mt-3 font-bold">
          Description
        </label>
        <textarea
          type="text"
          rows="5"
          cols="50"
          name="description"
          defaultValue={actionData?.values.description ?? snippet.description}
          id="description"
          className={`p-2 rounded-md w-80 ${
            actionData?.errors.description ? "border-2 border-red-500" : null
          }
          `}
        />
        <label htmlFor="img" className="block mt-3 font-bold">
          Img
        </label>
        <input
          type="text"
          name="img"
          defaultValue={actionData?.values.img ?? snippet.img}
          id="img"
          className={`p-2 rounded-md w-80 ${
            actionData?.errors.img ? "border-2 border-red-500" : null
          }
          `}
        />
        <br />
        <button
          type="submit"
          className="mt-5 bg-lime-400 hover:bg-teal-400 px-8 py-2 rounded-xl shadow-sm shadow-slate-500 text-xl font-bold"
        >
          Save
        </button>
      </Form>
    </div>
  );
}

// export default function Update() {
//   return <h1>scaaaa</h1>;
// }
