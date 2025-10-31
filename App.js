//import necessary modules from "react";
import React, { useState } from "react";
//main functional component of the app
export default function App() {
  //state variables for managing app data
  const [bookTitle, setBookTitle] = useState(""); //user's search input
  const [books, setBooks] = useState([]); // stores book search results
  const [selectedGenre, setSelectedGenre] = useState(""); //stores selected geners
  const [selectedLanguage, setSelectedLanguage] = useState(""); // stores selected languages
  const [error, setError] = useState(""); //stores error message
  const [loading, setLoading] = useState(false); //shows loading state during API fetch

  //function to fetch books from openlibrary API
  const searchBooks = async () => {
    //if no title entered, show error
    if (!bookTitle.trim()) {
      setError("Please enter a book title.");
      setBooks([]);
      return;
    }
    // reset error and show loading
    setError("");
    setLoading(true);

    try {
      //fetch books using openlibrary search API
      const res = await fetch(
        `https://openlibrary.org/search.json?title=${encodeURIComponent(
          bookTitle
        )}`
      );
      const data = await res.json();
      //if no results found
      if (!data.docs || data.docs.length === 0) {
        setError("No books found.");
        setBooks([]);
      } else {
        //save first 9 books results to display
        setBooks(data.docs.slice(0, 9));
        console.log(data.docs[0]);
      }
    } catch (err) {
      // handle any network or API errors
      setError("Failed to fetch data. Try again later.");
    }
    //turn off loading
    setLoading(false);
  };
  //main UI rendering
  return (
    <div
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1920&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        backgroundCover: "blur",
      }}
    >
      {/* your input, button, and results code below */}
      <h1 className="text-4xl font-bold text-purple-300 mb-6">
        📚 Book Finder
      </h1>
      {/* Search controls */}
      <div className="flex items-start gap-3 mb-6">
        <input
          type="text"
          value={bookTitle}
          onChange={(e) => setBookTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") searchBooks(); //trigger search on enter key
          }}
          placeholder="Enter book title..."
          className="px-4 py-2 border border-gray-400 rounded-lg w-64 focus:ring-2 focus:ring-blue-500"
        />
        {/*genre and language selection*/}
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={searchBooks}
            className="bg-red-200 text-green px-9 py-2 rounded-lg hover:bg-white-700"
          >
            Search
          </button>
          <div className="flex gap-4 mb-6">
            {/* genre dropdown */}
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="p-2 rounded-lg bg-white/70 text-gray-800"
            >
              <option value="">All Genres</option>
              <option value="Fiction">Fiction</option>
              <option value="Romance">Romance</option>
              <option value="Mystery">Mystery</option>
              <option value="Fantasy">Fantasy</option>
              <option value="Science">Science</option>
            </select>
            {/* language dropdown */}
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="p-2 rounded-lg bg-white/70 text-gray-800"
            >
              <option value="">All Languages</option>
              <option value="English">English</option>
              <option value="Malayalam">Malayalam</option>
              <option value="Tamil">Tamil</option>
              <option value="Hindi">Hindi</option>
            </select>
          </div>
          {/* search and clear buttons */}
          <button
            type="button"
            onClick={() => {
              setBookTitle("");
              setBooks([]);
              setError("");
              setLoading(false);
            }}
            className="bg-red-400 text-blue px-4 py-2 rounded-lg hover:bg-white-500"
          >
            Clear
          </button>
        </div>
      </div>
      {/* display error message */}
      {error && (
        <p className="text-black-900 bg-purple-100 bold mb-8 text-center">
          {error}
        </p>
      )}
      {/* display loading message */}
      {loading && (
        <p className="text-red-900 bg-yellow-200 bold mb-7">🔍 Searching...</p>
      )}
      {/* display list of fetched books*/}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-6">
        {books.map((book) => (
          <div
            key={book.key}
            className="p-4 bg-white shadow rounded-lg flex flex-col items-center text-center"
          >
            {/* book cover Image */}
            {book.cover_i ? (
              <img
                src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
                alt={book.title}
                className="w-32 h-48 object-cover mb-3 rounded shadow-md border border-gray-300"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg";
                }}
              />
            ) : (
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg"
                alt="No cover available"
                className="w-32 h-48 object-cover mb-3 rounded opacity-90 border border-gray-300"
              />
            )}
            <h3 className="text-lg font-semibold text-blue-700">
              {book.title}
            </h3>
            <p className="text-gray-600">
              {book.author_name?.join(", ") || "Unknown Author"}
            </p>
            <p className="text-gray-500 text-sm">
              First Published: {book.first_publish_year || "N/A"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
