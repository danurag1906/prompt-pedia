"use client";

import { useState, useEffect } from "react";

import PromptCard from "./PromptCard";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import { useMainContext } from "@context/MainContext";

// const PromptCardList = ({ data, userdata, handleTagClick }) => {
//   return (
//     <div className="mt-16 prompt_layout">
//       {data.map((item) => (
//         <PromptCard
//           key={item._id}
//           prompt={item}
//           isLiked={isLiked}
//           setIsLiked={setIsLiked}
//           likeCount={likeCount}
//           setLikeCount={setLikeCount}
//           handleLike={() => handleLike(item._id)}
//           handleBookmark={() => handleBookmark(item._id)}
//           handleShare={() => handleShare(item._id)}
//           handleCopy={() => handleCopy(item._id)}
//           fetchLikeStatus={() => fetchLikeStatus(item._id)}
//           fetchBookmarkStatus={() => fetchBookmarkStatus(item._id)}
//           fetchLikeCount={() => fetchLikeCount(item._id)}
//           isBookmarked={isBookmarked}
//           handleTagClick={handleTagClick}
//           copied={copied}
//           setCopied={setCopied}
//           sharePopup={sharePopup}
//           setSharePopup={setSharePopup}
//           setIsBookmarked={setIsBookmarked}
//         />
//       ))}
//     </div>
//   );
// };

const Feed = () => {
  const pathName = usePathname();
  const { data: session } = useSession();
  // const router = useRouter();
  const userId = session?.user.id;

  const {
    searchText,
    // setSearchText,
    searchResult,
    // setSearchResult,
    prompts,
    setPrompts,
    copied,
    // setCopied,
    sharePopup,
    setSharePopup,
    isBookmarked,
    setIsBookmarked,
    user,
    setUser,
    bookmarkLoading,
    // setBookmarkLoading,
    feedLoading,
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
    // filterPrompts,
  } = useMainContext();

  const fetchUser = async () => {
    const userid = session?.user.id;
    // console.log(userid, "userId");
    setUser(userid);
    // console.log(user, "fetchuser , user");
    const response = await fetch(`/api/users/${session?.user.id}`);
    const data = await response.json();

    // console.log(data[0], "user");

    if (data && data.length > 0) {
      // console.log(data, "inside if");
      // Update user state
      setUser(data[0]);
    }

    // Check if user is available
    if (data && data.length > 0) {
      const userData = data[0];
      // console.log(userData, "userData");

      // Check if prompts are available
      if (prompts.length > 0) {
        // Initialize isLiked object with all prompt IDs marked as false
        const initialIsLikedState = prompts.reduce((acc, item) => {
          // console.log("Initializing", item._id);
          return { ...acc, [item._id]: false };
        }, {});

        // Update liked prompts to true in the isLiked object
        const updatedIsLikedState = userData.likedPrompts.reduce(
          (acc, item) => {
            // console.log("Updating", item);
            return { ...acc, [item]: true };
          },
          initialIsLikedState
        );

        // Update state with the updatedIsLikedState using callback form of setState
        setIsLiked((prevState) => ({
          ...prevState,
          ...updatedIsLikedState,
        }));
      }
    }
  };

  const fetchPrompts = async () => {
    // setFeedLoading(true);

    try {
      const response = await fetch("/api/prompt", { cache: "no-store" });
      const data = await response.json();

      setPrompts(data.reverse());

      setLikeCount(
        data.reduce((acc, item) => {
          return { ...acc, [item._id]: item.likes };
        }, {})
      );
    } catch (error) {
      // console.error("Error fetching prompts:", error);
      toast.error("Error fetching prompts:", error);
    }
  };

  useEffect(() => {
    fetchPrompts();
    if (session) {
      fetchUser();
    }
  }, [session]);

  useEffect(() => {
    if (prompts.length > 0 && user) {
      // console.log(user, "useEffect");
      // Initialize isLiked object with all prompt IDs marked as false
      const initialIsLikedState = prompts.reduce((acc, item) => {
        return { ...acc, [item._id]: false };
      }, {});

      // Update liked prompts to true in the isLiked object
      const updatedIsLikedState = user.likedPrompts?.reduce((acc, item) => {
        return { ...acc, [item]: true };
      }, initialIsLikedState);

      // Update state with the updatedIsLikedState using callback form of setState
      setIsLiked((prevState) => ({
        ...prevState,
        ...updatedIsLikedState,
      }));
      fetchBookmarkStatus(session?.user.id);
    }
  }, [prompts, user]);

  // console.log(prompts);

  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        <input
          type="text"
          placeholder="Search for a tag or a username or content in prompt"
          value={searchText}
          onChange={handleSearchChange}
          required
          className="search_input peer"
        />
      </form>
      {/* {user && user.email} */}
      {/* All Prompts */}
      {/* {prompts && prompts.map((prompt) => <p>{prompt.promptText}</p>)} */}
      {/* {searchText ? (
        <PromptCardList data={searchResult} handleTagClick={handleTagClick} />
      ) : (
        <PromptCardList
          data={prompts}
          userdata={user}
          handleTagClick={handleTagClick}
        />
      )} */}

      {searchText ? (
        <div className="mt-16 prompt_layout">
          {searchResult.map((item) => (
            <PromptCard
              key={item._id}
              prompt={item}
              user={user}
              isLiked={isLiked[item._id]}
              setIsLiked={setIsLiked}
              likeCount={likeCount[item._id]}
              setLikeCount={item.likes}
              handleLike={handleLike}
              handleBookmark={handleBookmark}
              handleShare={handleShare}
              handleCopy={handleCopy}
              fetchLikeStatus={() => fetchLikeStatus(item._id)}
              fetchBookmarkStatus={() => fetchBookmarkStatus(item._id)}
              fetchLikeCount={() => fetchLikeCount(item._id)}
              isBookmarked={isBookmarked[item._id]}
              handleTagClick={handleTagClick}
              copied={copied}
              // setCopied={setCopied}
              sharePopup={sharePopup}
              setSharePopup={setSharePopup}
              setIsBookmarked={setIsBookmarked}
            />
          ))}
        </div>
      ) : (
        <>
          {feedLoading && <p>Loading...</p>}
          {bookmarkLoading && <p>Loading...</p>}
          <div className="mt-16 prompt_layout">
            {prompts.map((item) => (
              <PromptCard
                key={item._id}
                prompt={item}
                user={user}
                isLiked={isLiked[item._id]}
                setIsLiked={setIsLiked}
                likeCount={likeCount[item._id]}
                setLikeCount={item.likes}
                handleLike={handleLike}
                handleBookmark={handleBookmark}
                handleShare={handleShare}
                handleCopy={handleCopy}
                fetchLikeStatus={() => fetchLikeStatus(item._id)}
                fetchBookmarkStatus={() => fetchBookmarkStatus(item._id)}
                fetchLikeCount={() => fetchLikeCount(item._id)}
                isBookmarked={isBookmarked[item._id]}
                handleTagClick={handleTagClick}
                copied={copied}
                // setCopied={setCopied}
                sharePopup={sharePopup}
                setSharePopup={setSharePopup}
                setIsBookmarked={setIsBookmarked}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default Feed;
