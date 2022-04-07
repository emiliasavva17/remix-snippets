import { redirect } from "remix";
import connectDb from "~/db/connectDb.server";

export async function action({ request }) {
  const db = await connectDb();
  const data = await request.formData();
  await db.models.Snippet.deleteOne({ _id: data._fields.id });
  return redirect("/");
}
