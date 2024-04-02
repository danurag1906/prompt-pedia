"use client";
import Link from "next/link";
import PromptCard from "./PromptCard";
import { useMainContext } from "@context/MainContext";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

const Profile = ({
  name,
  desc,
  data,
  handleEdit,
  handleDelete,
  // handleRemoveBookmark,
}) => {
  const {
    searchText,
    setSearchText,
    searchResult,
    setSearchResult,
    prompts,
    setPrompts,
    copied,
    setCopied,
    sharePopup,
    setSharePopup,
    isBookmarked,
    setIsBookmarked,
    user,
    setUser,
    bookmarkLoading,
    setBookmarkLoading,
    feedLoading,
    setFeedLoading,
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

  useEffect(() => {
    {
      data &&
        data.map((prompt) => {
          fetchLikeCount(prompt._id),
            fetchLikeStatus(prompt._id, session?.user.id),
            fetchBookmarkStatus(session?.user.id);
        });
    }
  }, [data]);
  // const removeBookmark = (promptId) => {
  //   handleRemoveBookmark(promptId);
  // };

  // console.log(data, "data");
  return (
    <section className="w-full">
      {/* <form className="relative w-full flex-center">
        <input
          type="text"
          placeholder="Search for a tag or a username or content in prompt"
          value={searchText}
          onChange={handleSearchChange}
          required
          className="search_input peer"
        />
      </form> */}
      <h1 className="text-xl font-bold text-left">
        <span className="blue_gradient">{name} </span>
        Profile
      </h1>
      <p className="my-2">
        you might get random numbers for username at the end to avoid
        duplication
      </p>
      {/* <p className="desc text-left">{desc}</p> */}
      <div className="mt-16 prompt_layout">
        {data &&
          data.map((promptItem) => (
            // console.log(promptItem, "promptItem"),
            // console.log(isLiked, "isLiked"),
            <PromptCard
              key={promptItem._id}
              prompt={promptItem}
              isLiked={isLiked[promptItem._id]}
              setIsLiked={setIsLiked}
              likeCount={likeCount[promptItem._id]}
              setLikeCount={promptItem.likes}
              handleLike={handleLike}
              handleBookmark={handleBookmark}
              handleShare={handleShare}
              handleCopy={handleCopy}
              fetchLikeStatus={() => fetchLikeStatus(promptItem._id)}
              fetchBookmarkStatus={() => fetchBookmarkStatus(promptItem._id)}
              fetchLikeCount={() => fetchLikeCount(promptItem._id)}
              isBookmarked={isBookmarked[promptItem._id]}
              handleTagClick={handleTagClick}
              copied={copied}
              // setCopied={setCopied}
              sharePopup={sharePopup}
              setSharePopup={setSharePopup}
              setIsBookmarked={setIsBookmarked}
              onHandleEdit={() => handleEdit && handleEdit(promptItem)}
              onHandleDelete={() => handleDelete && handleDelete(promptItem)}
              // onRemoveBookmark={removeBookmark}
            />
          ))}
      </div>
    </section>
  );
};

export default Profile;
