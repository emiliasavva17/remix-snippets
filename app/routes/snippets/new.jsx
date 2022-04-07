import { Form, redirect, json, useActionData, Link } from "remix";
import connectDb from "~/db/connectDb.server";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

library.add(faArrowLeft);

export async function action({ request }) {
  const form = await request.formData();
  const db = await connectDb();
  try {
    const newSnippet = await db.models.Snippet.create({
      title: form.get("title"),
      language: form.get("language"),
      description: form.get("description"),
      snippet: form.get("snippet"),
      img: form.get("img"),
      creadedAt: new Date(),
      updatedAt: new Date(),
    });
    return redirect(`/#main/${newSnippet._id}`);
  } catch (error) {
    return json(
      { errors: error.errors, values: Object.fromEntries(form) },
      { status: 400 }
    );
  }
}

export default function CreateSnippet() {
  const actionData = useActionData();
  return (
    <div>
      <Link to="/#main" className="inline-block mt-3 font-bold underline ">
        <FontAwesomeIcon icon="fa-arrow-left" className="h-4 px-2" />
        Back
      </Link>
      <div className="text-center m-0">
        <h1 className="text-3xl font-bold my-5">Create a snippet</h1>
        <section className="container mx-auto  md:w-1/2 p-5 border-2 bg-neutral-100 border-teal-800 rounded-lg">
          <Form method="post">
            <label htmlFor="title" className="block font-bold">
              Title
            </label>
            <input
              type="text"
              name="title"
              defaultValue={actionData?.values.title}
              id="title"
              placeholder="F.e. Very cool snippet"
              className={`p-2 rounded-md w-full ${
                actionData?.errors.description
                  ? "border-2 border-red-500"
                  : null
              }
          `}
            />

            <label htmlFor="language" className="block mt-3 font-bold">
              Language
            </label>
            <input
              type="text"
              name="language"
              defaultValue={actionData?.values.language}
              id="language"
              placeholder="F.e. React, Ionic"
              className={`p-2 rounded-md w-full ${
                actionData?.errors.description
                  ? "border-2 border-red-500"
                  : null
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
              defaultValue={actionData?.values.description}
              id="description"
              placeholder="Describe your snippet"
              className={`p-2 rounded-md w-full ${
                actionData?.errors.description
                  ? "border-2 border-red-500"
                  : null
              }
          `}
            />

            <label htmlFor="snippet" className="block mt-3 font-bold">
              Snippet
            </label>
            <textarea
              type="text"
              rows="10"
              cols="50"
              name="snippet"
              defaultValue={actionData?.values.snippet}
              id="snippet"
              placeholder="Write your snippet"
              className={`p-2 rounded-md w-full ${
                actionData?.errors.description
                  ? "border-2 border-red-500"
                  : null
              }
          `}
            ></textarea>

            <label htmlFor="img" className="block mt-3 font-bold">
              Image source
            </label>
            <input
              type="text"
              name="img"
              defaultValue={actionData?.values.img}
              id="img"
              placeholder="URL of your snippet image"
              className={`p-2 rounded-md w-full ${
                actionData?.errors.description
                  ? "border-2 border-red-500"
                  : null
              }
          `}
            />

            {/* {actionData?.errors.title && (
          <p className="text-red-500">{actionData.errors.title.message}</p>
        )} */}
            <br />
            <button
              type="submit"
              className="mt-5 bg-teal-700 hover:bg-teal-800 text-white px-8 py-2 rounded-2xl shadow-sm shadow-slate-500 text-xl text-semibold"
            >
              Save
            </button>
          </Form>
        </section>
      </div>
    </div>
  );
}
