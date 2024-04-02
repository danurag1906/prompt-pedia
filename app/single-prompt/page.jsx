"use client";
import { useState, useEffect } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { Suspense } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { toast } from "react-hot-toast";
const { useMainContext } = require("@context/MainContext");

const SinglePrompt = () => {
  function SuspenseSinglePrompt() {
    const {
      // searchText,
      // setSearchText,
      // searchResult,
      // setSearchResult,
      // prompts,
      // setPrompts,
      copied,
      // setCopied,
      sharePopup,
      // setSharePopup,
      isBookmarked,
      // setIsBookmarked,
      // user,
      // setUser,
      // bookmarkLoading,
      // setBookmarkLoading,
      // feedLoading,
      // setFeedLoading,
      likeCount,
      // setLikeCount,
      isLiked,
      // setIsLiked,
      handleBookmark,
      fetchBookmarkStatus,
      fetchLikeCount,
      fetchLikeStatus,
      handleLike,
      handleCopy,
      handleShare,
      // handleSearchChange,
      // handleTagClick,
      // filterPrompts,
    } = useMainContext();
    const [prompt, setPrompt] = useState({
      promptText: "",
      result: "",
      tagLine: "",
    });
    const searchParams = useSearchParams();
    const promptId = searchParams.get("id");
    const profileUsername = searchParams.get("pun");
    // console.log(promptId, "promptId");

    useEffect(() => {
      const getPromptDetails = async () => {
        const response = await fetch(`/api/prompt/${promptId}`, {
          cache: "no-store",
        });
        const data = await response.json();
        setPrompt({
          promptText: data.promptText,
          result: data.result,
          tagLine: data.tagLine,
        });
      };
      if (promptId) {
        getPromptDetails();
      }
    }, [promptId]);

    const pathName = usePathname();
    const { data: session } = useSession();
    const router = useRouter();
    const userId = session?.user.id;

    // State variables to manage hover states for each icon
    const [copyHovered, setCopyHovered] = useState(false);
    const [shareHovered, setShareHovered] = useState(false);
    const [bookmarkHovered, setBookmarkHovered] = useState(false);

    useEffect(() => {
      // console.log("indide useeffect");
      if (session) {
        fetchLikeCount(promptId); // Fetch like count when component mounts
        fetchLikeStatus(promptId, userId);
        fetchBookmarkStatus(userId);
      }

      // }
    }, [session]);

    return (
      <section className="w-full mx-4 my-8">
        {/* {promptId}
        {prompt.promptText}
        {prompt.desc}
        {prompt.tagLine} */}
        <div className="flex  flex-col gap-7 prompt_card_full">
          <div className="flex gap-4">
            <div
              className="copy_btn relative"
              onMouseEnter={() => setCopyHovered(true)}
              onMouseLeave={() => setCopyHovered(false)}
              onClick={() => handleCopy(prompt.promptText)}
            >
              <Image
                src={
                  // copied
                  copied === prompt.promptText
                    ? "/assets/icons/tick.svg"
                    : "/assets/icons/copy.svg"
                }
                width={12}
                height={12}
                alt="copy_icon"
              />
              {copyHovered && (
                <span className="tooltip tooltip-top absolute bottom-8 bg-black text-white py-1 px-2 rounded text-xs">
                  Copy
                </span>
              )}
            </div>
            <div
              className="copy_btn relative"
              onMouseEnter={() => setShareHovered(true)}
              onMouseLeave={() => setShareHovered(false)}
              onClick={() => handleShare(promptId, profileUsername)}
            >
              <Image
                src={
                  sharePopup === true
                    ? // sharePopup
                      "/assets/icons/tick.svg"
                    : "/assets/icons/share.svg"
                }
                width={12}
                height={12}
                alt="share_icon"
              />
              {shareHovered && (
                <span className="tooltip tooltip-top absolute bottom-8 bg-black text-white py-1 px-2 rounded text-xs">
                  Share
                </span>
              )}
            </div>
            {session && (
              <div
                className="copy_btn relative"
                onMouseEnter={() => setBookmarkHovered(true)}
                onMouseLeave={() => setBookmarkHovered(false)}
                onClick={() => handleBookmark(promptId, userId)}
              >
                <Image
                  src={
                    isBookmarked[promptId]
                      ? "/assets/icons/bookmark.svg"
                      : "/assets/icons/bookmark-light.svg"
                  }
                  width={12}
                  height={12}
                  alt="bookmark_icon"
                />
                {bookmarkHovered && (
                  <span className="tooltip tooltip-top absolute bottom-8 bg-black text-white py-1 px-2 rounded text-xs">
                    Bookmark
                  </span>
                )}
              </div>
            )}
            {session && (
              <>
                <div
                  className="copy_btn cursor-pointer "
                  onClick={() => handleLike(promptId, session?.user.id)}
                >
                  <Image
                    src={
                      isLiked[promptId]
                        ? "/assets/icons/heart-filled.svg"
                        : "/assets/icons/heart-outline.svg"
                    }
                    width={12}
                    height={12}
                    alt="like_icon"
                    className={`transition-colors duration-300 ${
                      isLiked
                        ? "text-red-500"
                        : "text-gray-500 hover:text-red-500"
                    }`}
                  />
                </div>
                <span className="text-sm text-gray-500 p-1">
                  {likeCount[promptId]}
                </span>
              </>
            )}
          </div>
          <h1 className="text-3xl font-bold font-satoshi text-left blue_gradient">
            {profileUsername}'s prompt
          </h1>
          <h1 className="text-xl font-bold font-satoshi my-2">
            {prompt.promptText}
          </h1>
          <p
            className="text-lg font-satoshi my-2"
            style={{ whiteSpace: "pre-line" }}
          >
            {prompt.result}
          </p>
          <p className="font-inter text-md blue_gradient ">{prompt.tagLine}</p>
        </div>
      </section>
    );
    // console.log(prompt, "prompt");
  }

  return (
    <Suspense>
      <SuspenseSinglePrompt />
    </Suspense>
  );
};

export default SinglePrompt;
