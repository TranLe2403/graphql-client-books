import React, { useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import { ALL_AUTHORS, ALL_BOOKS } from "./queries";
import { useQuery } from "@apollo/client";

const App = () => {
  const [page, setPage] = useState("authors");
  const getAuthors = useQuery(ALL_AUTHORS);
  const getBooks = useQuery(ALL_BOOKS);

  if (getAuthors.loading || getBooks.loading) {
    return <div>loading...</div>;
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        <button onClick={() => setPage("add")}>add book</button>
      </div>

      <Authors show={page === "authors"} authors={getAuthors.data.allAuthors} />

      <Books show={page === "books"} books={getBooks.data.allBooks} />

      <NewBook show={page === "add"} />
    </div>
  );
};

export default App;
