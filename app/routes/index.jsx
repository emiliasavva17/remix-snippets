import { useLoaderData, Link } from "remix";
import connectDb from "~/db/connectDb.server.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faGear,
  faSearch,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

library.add(faGear, faTrashCan, faSearch);

export async function loader() {
  const db = await connectDb();
  const snippets = await db.models.Snippet.find();
  return snippets;
}
const notify = () => toast("Snippet deleted");

export default function Index() {
  const [searchText, setSearchText] = useState("");
  let snippets = useLoaderData();
  const [show, setShow] = useState(null);

  let sortedSnippets = [];
  const [selectedOption, setSelectedOption] = useState();

  const toggle = (i) => {
    if (show == i) {
      return setShow(null);
    }
    setShow(i);
  };
  //const form = await requestAnimationFrame.formData();
  // const action = form.get("_action");
  // const snippestId = form.get("id");

  const sortBy = (e) => {
    setSelectedOption(e.target.value);

    if (e.target.value == "TitleA") {
      sortedSnippets = snippets.sort((a, b) => a.title.localeCompare(b.title));
      // snippets = sortedSnippets;
    }
    if (e.target.value == "TitleD") {
      sortedSnippets = snippets.sort((b, a) => a.title.localeCompare(b.title));
      // snippets = sortedSnippets;
    }

    if (e.target.value == "dateUpdatedA") {
      sortedSnippets = snippets.sort((a, b) => {
        return a.date_updated > b.date_updated ? 1 : -1;
      });
    }
    if (e.target.value == "dateUpdatedD") {
      sortedSnippets = snippets.sort((b, a) => {
        return a.date_updated > b.date_updated ? 1 : -1;
      });
    }

    // if (e.target.value == "favourited") {
    //   sortedSnippets = snippets.sort((a, b) => {
    //     return a.favourite < b.favourite ? 1 : -1;
    //   });
    //   // return sortedSnippets;
    // }
    snippets = sortedSnippets;
  };

  return (
    <section className="flex ">
      <div className="w-2/5 border-r-2  bg-neutral-200 p-3">
        {/* Search bar */}
        <div className="w-full pt-5">
          <FontAwesomeIcon icon="fa-search" height={14}></FontAwesomeIcon>
          <input
            type="text"
            className="mb-5 ml-3 p-2 w-11/12"
            value={searchText}
            placeholder="Search for a snippet"
            onChange={(event) => {
              setSearchText(event.target.value);
            }}
          ></input>
        </div>

        <div className="flex justify-between content-center m-4 ">
          {/* <label>Sort by</label> */}
          <select
            name=""
            id=""
            value={selectedOption}
            className=" w-44 h-9"
            onChange={sortBy}
          >
            <option value="value">Sort By</option>
            <option value="TitleA">Title Ascendent</option>
            <option value="TitleD">Title Descendent</option>

            <option value="dateUpdatedA" defaultValue="dateUpdated">
              Date Ascendent
            </option>
            <option value="dateUpdatedD" defaultValue="dateUpdated">
              Date Descendent
            </option>
            {/* <option value="favourited">Favourite</option> */}
          </select>
          <Link
            to="/snippets/new"
            className="mb-2 bg-teal-700  hover:bg-teal-800 text-white px-5 py-1 rounded-2xl shadow-sm shadow-slate-500 text-xl text-semibold "
          >
            Add Snippet
          </Link>
        </div>
        <br />
        {/* Filter through the snippets containing searched string in title */}
        <ul className="m-0 px-3">
          {snippets
            .filter((snippet) => {
              if (
                snippet.title
                  ?.toLowerCase()
                  .includes(searchText.toLowerCase()) ||
                snippet.language
                  ?.toLowerCase()
                  .includes(searchText.toLowerCase())
              ) {
                return snippet;
              } else if (searchText == "") {
                return snippet;
              }
            })
            .map((snippet, i) => {
              return (
                <div
                  className="snip-list mb-4 bg-emerald-50 border-lime-100 shadow-md shadow-slate-400 p-5 rounded-xl"
                  key={snippet._id}
                >
                  <ToastContainer />

                  <a href="/#main">
                    <li
                      key={snippet._id}
                      onClick={() => toggle(i)}
                      to={`/snippets/${snippet._id}`}
                      className=" text-gray-800 font-bold hover:none"
                    >
                      <h1 className="text-2xl">{snippet.title}</h1>
                      <h2>{snippet.language}</h2>

                      <p className="text-gray-500">
                        {new Date(snippet.updatedAt).toLocaleDateString([], {
                          year: "numeric",
                          month: "numeric",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </li>
                  </a>
                </div>
              );
            })}
        </ul>
      </div>
      <div className=" w-3/5 bg-zinc-50">
        {snippets.map((snippet, i) => {
          return (
            <div
              className={
                show == i
                  ? "block h-full w-full bg-stone-500 p-20 text-white"
                  : "hidden"
              }
              key={snippet._id}
            >
              <h1 className="text-5xl font-bold my-5">{snippet.title}</h1>
              <h2 className="text-xl font-semibold mb-3">
                Language: --{" "}
                <span className="font-light">{snippet.language}</span>
              </h2>
              <br />
              <p className="text-stone-100">
                updated at:{" "}
                {new Date(snippet.updatedAt).toLocaleDateString([], {
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <br />
              <hr></hr>
              <p className="font-normal text-lg text-ellipsis my-3">
                <span className="font-bold">Description:</span>
                <br />
                {snippet.description}
              </p>
              <br />
              {snippet.snippet && (
                <div id="display-snippet">
                  <h2 className="font-bold">Snippet:</h2>
                  <div className="w-full p-2  bg-stone-800">
                    <pre>{snippet.snippet}</pre>
                  </div>
                </div>
              )}

              <br />
              <br />
              <div id="crud" className="flex content-around justify-around">
                {/* Delete Snippet */}
                <form
                  method="post"
                  action="/snippets/delete"
                  className="bg-red-500 rounded-2xl p-2"
                >
                  <input type="hidden" name="id" value={snippet._id}></input>
                  <button
                    type="submit"
                    onClick={notify}
                    className="float-right text-xl cursor-pointer"
                  >
                    Delete
                    <FontAwesomeIcon icon="fa-trash-can" className="px-2" />
                  </button>
                </form>

                {/* Update Snippet
                  <Link
                    to={`/snippets/update/${snippet._id}`}
                    className="float-right mx-2 text-xl cursor-pointer"
                  >
                    <FontAwesomeIcon icon="fa-gear" />
                  </Link> */}

                {/* "Update" Snippet */}
                <form
                  method="post"
                  action="/snippets/test"
                  className="bg-teal-700 rounded-2xl p-2"
                >
                  <input type="hidden" name="id" value={snippet._id}></input>
                  <button
                    type="submit"
                    onClick={notify}
                    className="float-right mx-2 text-xl cursor-pointer"
                  >
                    Update
                    <FontAwesomeIcon icon="fa-gear" className="px-2" />
                  </button>
                </form>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
