import { Form, redirect, useActionData, useLoaderData } from "remix";
import connectDb from "~/db/connectDb.server";

// export async function action({ request }) {
//   const form = await request.formData();
//   const db = await connectDb();
//   //console.log(form._fields.id, " fadcv");
//   //const x = await db.model.Snippet.findOne({ _id: form._fields.id });
//   try {
//     const newSnippet = await db.models.Snippet.create({
//       title: form.get("title"),
//       language: form.get("language"),
//       description: form.get("description"),
//       img: form.get("img"),
//     });
//     return redirect(`/main/${newSnippet._id}`);
//   } catch (error) {
//     return json(
//       { errors: error.errors, values: Object.fromEntries(form) },
//       { status: 400 }
//     );
//   }
// }

export async function action({ request }) {
  const form = await request.formData();
  const doc = {
    title: form.get("title"),
    language: form.get("language"),
    description: form.get("description"),
    //snippet: form.get("snippet"),
    updatedAt: new Date(),
  };

  const db = await connectDb();
  const updatedSnippet = await db.models.Snippets.findByIdAndUpdate(
    form.get("id"),
    doc
  );

  try {
    await updatedSnippet.save();
    return redirect(
      `/snippets/${updatedSnippet.language}/${updatedSnippet._id}`
    );
  } catch (error) {
    return redirect(`/snippet/}`);
  }
}

export async function loader({ params }) {
  const db = await connectDb();

  return await db.models.Snippets.findOne({ _id: params.snippet });
}

export default function CreateBook() {
  const snippet = useLoaderData();
  console.log("Update Page");
  //const actionData = useActionData();
  return (
    <div className="text-center m-0">
      <h1 className="text-3xl font-bold my-5">Create a snippet</h1>
      <section className="container mx-auto my-20 md:w-1/3 p-5 border border-orange-700 rounded-lg">
        <Form method="post">
          <input type="hidden" name="id" value={snippet._id} />
          <label htmlFor="title" className="block font-bold">
            Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            defaultValue={snippet.title}
            // placeholder={snippet.title}
            //   className={`p-2 rounded-md w-80 ${
            //     actionData?.errors.description ? "border-2 border-red-500" : null
            //   }
            // `}
          />

          <label htmlFor="language" className="block mt-3 font-bold">
            Language
          </label>
          <input
            type="text"
            name="language"
            // defaultValue={actionData?.values.language}
            id="language"
            placeholder="F.e. React, Ionic"
            //   className={`p-2 rounded-md w-80 ${
            //     actionData?.errors.description ? "border-2 border-red-500" : null
            //   }
            // `}
          />

          <label htmlFor="description" className="block mt-3 font-bold">
            Description
          </label>
          <textarea
            type="text"
            rows="5"
            cols="50"
            name="description"
            // defaultValue={actionData?.values.description}
            id="description"
            placeholder="Describe your snippet"
            //   className={`p-2 rounded-md w-80 ${
            //     actionData?.errors.description ? "border-2 border-red-500" : null
            //   }
            // `}
          />

          <label htmlFor="img" className="block mt-3 font-bold">
            Image source
          </label>
          <input
            type="text"
            name="img"
            // defaultValue={actionData?.values.img}
            id="img"
            placeholder="URL of your snippet image"
            //   className={`p-2 rounded-md w-80 ${
            //     actionData?.errors.description ? "border-2 border-red-500" : null
            //   }
            // `}
          />

          {/* {actionData?.errors.title && (
          <p className="text-red-500">{actionData.errors.title.message}</p>
        )} */}
          <br />
          <button
            type="submit"
            className="mt-5 bg-lime-400 hover:bg-teal-400 px-8 py-2 rounded-2xl shadow-sm shadow-slate-500 text-xl font-bold"
          >
            Save
          </button>
        </Form>
      </section>
    </div>
  );
}
