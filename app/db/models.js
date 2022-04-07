import { mongoose } from "mongoose";

const { Schema } = mongoose;

// const bookSchema = new Schema({
//   title: {
//     type: String,
//     required: true,
//     minLength: [3, "That's too short"],
//   },
// });

// export const models = [
//   {
//     name: "Book",
//     schema: bookSchema,
//     collection: "books",
//   },
// ];

const snippets = new Schema({
  title: {
    type: String,
    required: true,
    minLength: [3, "That's too short"],
  },
  language: {
    type: String,
  },
  description: {
    type: String,
    minLength: [3, "That's too short"],
  },
  snippet: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    required: false,
  },
  updatedAt: {
    type: Date,
    required: false,
  },
});

export const snipModels = [
  {
    name: "Snippet",
    schema: snippets,
    collection: "snippets",
  },
];

mongoose.models = {};

mongoose.model("Snippet", snippets);
