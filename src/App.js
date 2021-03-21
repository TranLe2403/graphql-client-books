import React, { useState, useEffect } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import {
  ALL_AUTHORS,
  ALL_BOOKS,
  FAVORITE_BOOKS,
  ME,
  BOOK_ADDED,
} from "./queries";
import {
  useQuery,
  useApolloClient,
  useLazyQuery,
  useSubscription,
} from "@apollo/client";
import LoginForm from "./components/LoginForm";
import Recommendation from "./components/Recommendation";

const App = () => {
  const [token, setToken] = useState(null);
  const [page, setPage] = useState("authors");
  const getAuthors = useQuery(ALL_AUTHORS);
  const getBooks = useQuery(ALL_BOOKS);
  const meResult = useQuery(ME, { notifyOnNetworkStatusChange: true });
  const [getFavoriteBooks, favoriteBookResult] = useLazyQuery(FAVORITE_BOOKS);
  const [favoriteBookArray, setFavoriteBookArray] = useState([]);
  const client = useApolloClient();

  const updateCacheWith = (addedBook) => {
    const includedIn = (set, object) => {
      set.map((p) => p.id).includes(object.id);
    };

    const dataInStore = client.readQuery({ query: ALL_BOOKS });
    if (!includedIn(dataInStore.allBooks, addedBook)) {
      client.writeQuery({
        query: ALL_BOOKS,
        data: { allBooks: dataInStore.allBooks.concat(addedBook) },
      });
    }
  };

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const addedBook = subscriptionData.data.bookAdded;
      window.alert(`${addedBook.title} added`);
      updateCacheWith(addedBook);
    },
  });

  const logout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
  };

  useEffect(() => {
    if (favoriteBookResult.data) {
      setFavoriteBookArray(favoriteBookResult.data.favoriteBooks);
    }
  }, [favoriteBookResult.data]);

  useEffect(() => {
    setToken(localStorage.getItem("phonenumbers-user-token"));
  }, []);

  if (getAuthors.loading || getBooks.loading || meResult.loading) {
    return <div>loading...</div>;
  }

  console.log("getUser: ", meResult.data);
  console.log("books: ", getBooks);

  if (!token) {
    return (
      <div>
        <div>
          <button onClick={() => setPage("authors")}>authors</button>
          <button onClick={() => setPage("books")}>books</button>
          <button
            onClick={() => {
              setPage("login");
            }}
          >
            Login
          </button>
        </div>

        <Authors
          show={page === "authors"}
          authors={getAuthors.data.allAuthors}
        />

        <Books show={page === "books"} books={getBooks.data.allBooks} />

        <LoginForm
          show={page === "login"}
          setToken={setToken}
          setPage={setPage}
          meResult={meResult}
        />
      </div>
    );
  }

  // const favoriteBooks = () => {
  //   return getBooks.data.allBooks.filter((item) =>
  //     item.genres.includes(getUser.data.me.favoriteGenre)
  //   );
  // };

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        <button onClick={() => setPage("add")}>add book</button>
        <button
          onClick={() => {
            getFavoriteBooks();
            setPage("recommend");
          }}
        >
          recommend
        </button>
        <button onClick={logout}>Logout</button>
      </div>

      <Authors show={page === "authors"} authors={getAuthors.data.allAuthors} />

      <Books show={page === "books"} books={getBooks.data.allBooks} />

      <NewBook show={page === "add"} />

      <Recommendation
        show={page === "recommend"}
        books={favoriteBookArray}
        favoriteGenre={meResult.data.me.favoriteGenre}
        loading={favoriteBookResult.loading}
      />
    </div>
  );
};

export default App;
