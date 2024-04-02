"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import PromptCard from "@components/PromptCard";
import Feed from "@components/Feed";
import { useMainContext } from "@context/MainContext";
const Bookmarks = () => {
  const {
    // searchText,
    // setSearchText,
    // searchResult,
    // setSearchResult,
    // prompts,
    // setPrompts,
    copied,
    setCopied,
    sharePopup,
    setSharePopup,
    isBookmarked,
    setIsBookmarked,
    // user,
    // setUser,
    // bookmarkLoading,
    // setBookmarkLoading,
    // feedLoading,
    // setFeedLoading,
    likeCount,
    setLikeCount,
    isLiked,
    setIsLiked,
    handleBookmark,
    fetchBookmarkStatus,
    fetchLikeCount,
    fetchLikeStatus,
    handleLike,
    handleCopy,
    handleShare,
    handleSearchChange,
    handleTagClick,
    filterPrompts,
  } = useMainContext();

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
    // console.log(data, "data");
    setBookmarks(data);
    setLoading(false);
  };

  useEffect(() => {
    if (userId) {
      fetchBookmarks();

      // console.log(bookmarks, "bookmarks");
    }
  }, [userId]);

  useEffect(() => {
    {
      bookmarks &&
        bookmarks.map((bookmark) => {
          fetchLikeCount(bookmark._id);
          fetchLikeStatus(bookmark._id, session?.user.id);
          fetchBookmarkStatus(session?.user.id);
        });
    }
  }, [bookmarks]);

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
              // user={user}
              isLiked={isLiked[bookmark._id]}
              setIsLiked={setIsLiked}
              likeCount={likeCount[bookmark._id]}
              setLikeCount={bookmark.likes}
              handleLike={handleLike}
              handleBookmark={handleBookmark}
              handleShare={handleShare}
              handleCopy={handleCopy}
              fetchLikeStatus={() => fetchLikeStatus(bookmark._id)}
              fetchBookmarkStatus={() => fetchBookmarkStatus(bookmark._id)}
              fetchLikeCount={() => fetchLikeCount(bookmark._id)}
              isBookmarked={isBookmarked[bookmark._id]}
              handleTagClick={handleTagClick}
              copied={copied}
              // setCopied={setCopied}
              sharePopup={sharePopup}
              setSharePopup={setSharePopup}
              setIsBookmarked={setIsBookmarked}
              onRemoveBookmark={removeBookmark}
            />
          </div>
        ))}
      {/* <Feed /> */}
    </section>
  );
};

export default Bookmarks;
