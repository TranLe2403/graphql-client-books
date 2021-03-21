import React, { useState } from "react";

const Books = (props) => {
  const [genre, setGenre] = useState("all genres");

  if (!props.show) {
    return null;
  }

  const books = props.books;

  const genresArr = books.reduce(
    (acc, bookItem) => acc.concat(bookItem.genres),
    []
  );

  const allGenres = genresArr.filter(
    (genre, index, arr) => arr.indexOf(genre) === index
  );
  return (
    <div>
      <h2>books</h2>

      <p>
        in genre <strong>{genre}</strong>
      </p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books
            .filter((item) =>
              genre === "all genres" ? item : item.genres.includes(genre)
            )
            .map((a) => (
              <tr key={a.title}>
                <td>{a.title}</td>
                <td>{a.author.name}</td>
                <td>{a.published}</td>
              </tr>
            ))}
        </tbody>
      </table>
      {allGenres.map((item) => (
        <button onClick={() => setGenre(item)} key={item}>
          {item}
        </button>
      ))}
      <button onClick={() => setGenre("all genres")}>all genres</button>
    </div>
  );
};

export default Books;
