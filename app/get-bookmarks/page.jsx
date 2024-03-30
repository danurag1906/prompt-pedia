"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import PromptCard from "@components/PromptCard";
const Bookmarks = () => {
  const { data: session } = useSession();
  //   console.log(session?.user.id, "id");
  const userId = session?.user.id;
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(false);
  //   console.log(bookmarks);

  const fetchBookmarks = async () => {
    setLoading(true);
    const response = await fetch(`/api/bookmarks/getBookmarks/${userId}`);
    const data = await response.json();
    setBookmarks(data);
    setLoading(false);
  };

  useEffect(() => {
    if (userId) {
      fetchBookmarks();
    }
  }, [userId]);

  const removeBookmark = (promptId) => {
    setBookmarks(bookmarks.filter((bookmark) => promptId !== bookmark._id));
  };

  return (
    <section className="flex flex-wrap gap-2">
      {bookmarks.length == 0 && !loading && <p>No bookmarks found</p>}
      {loading && <p>Loading</p>}
      {bookmarks &&
        bookmarks.map((bookmark) => (
          <div key={bookmark._id}>
            <PromptCard
              key={bookmark._id}
              prompt={bookmark}
              onRemoveBookmark={removeBookmark}
            />
          </div>
        ))}
    </section>
  );
};

export default Bookmarks;
