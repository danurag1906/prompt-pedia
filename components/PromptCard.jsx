"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

import { toast } from "react-hot-toast";
import { useMainContext } from "@context/MainContext";

const PromptCard = ({
  prompt,
  // user,
  handleTagClick,
  onHandleEdit,
  onHandleDelete,
  onRemoveBookmark,
  isLiked,
  // setIsLiked,
  likeCount,
  // setLikeCount,
  handleLike,
  handleBookmark,
  handleShare,
  handleCopy,
  // fetchLikeStatus,
  // fetchBookmarkStatus,
  // fetchLikeCount,
  isBookmarked,
  // setIsBookmarked,
  copied,
  // setCopied,
  sharePopup,
  // setSharePopup,
}) => {
  const pathName = usePathname();
  const { data: session } = useSession();
  const router = useRouter();
  const userId = session?.user.id;

  // // State variables to manage hover states for each icon
  const [copyHovered, setCopyHovered] = useState(false);
  const [shareHovered, setShareHovered] = useState(false);
  const [bookmarkHovered, setBookmarkHovered] = useState(false);

  return (
    <>
      <div className="prompt_card  ">
        {/* {prompt} */}
        <div className="flex justify-between items-start gap-5">
          <div className="flex-1 flex justify-start items-center gap-3 cursor-pointer">
            <Link href={`/profile/unique?pid=${prompt.creator._id}`}>
              <Image
                src={prompt.creator.image}
                alt="user_image"
                width={40}
                height={40}
                className="rounded-full object-contain"
              />
              <div className="flex flex-col">
                <h3 className="font-satoshi font-semibold text-gray-900">
                  {prompt.creator.username}
                </h3>
              </div>
            </Link>
          </div>
          <div
            className="copy_btn relative"
            onMouseEnter={() => setCopyHovered(true)}
            onMouseLeave={() => setCopyHovered(false)}
            onClick={() => handleCopy(prompt.promptText)}
          >
            <Image
              src={
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
            onClick={() => handleShare(prompt._id, prompt.creator.username)}
          >
            <Image
              src={
                sharePopup[prompt._id] === true
                  ? "/assets/icons/tick.svg"
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
          {session && pathName !== "/profile" && (
            <div
              className="copy_btn relative"
              onMouseEnter={() => setBookmarkHovered(true)}
              onMouseLeave={() => setBookmarkHovered(false)}
              onClick={() => {
                handleBookmark(prompt._id, userId);
                if (pathName === "/get-bookmarks") {
                  onRemoveBookmark(prompt._id);
                }
              }}
            >
              <Image
                src={
                  isBookmarked
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
                onClick={() => {
                  // console.log(prompt, "promtp");
                  // console.log(
                  //   prompt._id,
                  //   session?.user.id,
                  //   "handleLike promtpcard"
                  // );
                  handleLike(prompt._id, session?.user.id);
                }}
              >
                <Image
                  src={
                    isLiked
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
              <span className="text-sm text-gray-500 p-1">{likeCount}</span>
            </>
          )}
        </div>

        <Link
          href={`/single-prompt?id=${prompt._id}&pun=${prompt.creator.username}`}
        >
          <p className="my-4 font-satoshi text-sm text-gray-700">
            {prompt.promptText}
          </p>
        </Link>
        <p
          className="font-inter text-sm blue_gradient cursor-pointer"
          onClick={() => handleTagClick && handleTagClick(prompt.tagLine)}
        >
          {prompt.tagLine}
        </p>
        {session?.user.id === prompt.creator._id && pathName === "/profile" && (
          <div className="flex items-center mt-5 gap-4">
            <p
              className="font-inter text-sm green_gradient cursor-pointer"
              onClick={onHandleEdit}
            >
              Edit
            </p>
            <p
              className="font-inter text-sm orange_gradient cursor-pointer"
              onClick={onHandleDelete}
            >
              Delete
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default PromptCard;
