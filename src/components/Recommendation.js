import React from "react";

const Recommendation = (props) => {
  if (!props.show || !props.books) {
    return null;
  }

  if (props.loading) {
    return <div>loading...</div>;
  }

  console.log(props);
  return (
    <div>
      <h2>Recommendation</h2>

      <p>
        book in your favorite genre <strong>{props.favoriteGenre}</strong>
      </p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {props.books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <br />
    </div>
  );
};

export default Recommendation;
