import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import Select from "react-select";

import { EDIT_AUTHOR, ALL_AUTHORS } from "../queries";

const Authors = (props) => {
  const authors = props.authors;
  const authorOptions = authors.map((author) => {
    return { value: author.name, label: author.name };
  });

  const [birthyear, setBirthyear] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  });

  if (!props.show) {
    return null;
  }

  const submit = (event) => {
    event.preventDefault();

    editAuthor({
      variables: { name: selectedOption.value, setBornTo: Number(birthyear) },
    });

    setSelectedOption(null);
    setBirthyear("");
  };

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Set Birthyear</h2>
      <form onSubmit={submit}>
        <Select
          defaultValue={selectedOption}
          onChange={setSelectedOption}
          options={authorOptions}
        />
        <div>
          born
          <input
            value={birthyear}
            onChange={({ target }) => setBirthyear(target.value)}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  );
};

export default Authors;
