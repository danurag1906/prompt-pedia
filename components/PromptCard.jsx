"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

import { toast } from "react-hot-toast";

const PromptCard = ({
  prompt,
  handleTagClick,
  onHandleEdit,
  onHandleDelete,
  onRemoveBookmark,
}) => {
  const handleCopy = () => {
    setCopied(prompt.promptText);
    navigator.clipboard.writeText(prompt.promptText);
    setTimeout(() => setCopied(""), 2000);
    toast.success("Prompt copied to clipboard");
  };

  const handleShare = () => {
    const url = `http://localhost:3000/single-prompt?id=${prompt._id}&pun=${prompt.creator.username}`;
    navigator.clipboard.writeText(url);
    setSharePopup(true);
    setTimeout(() => setSharePopup(false), 2000);
    toast.success("Link copied to clipboard");
  };

  const [copied, setCopied] = useState("");
  const [sharePopup, setSharePopup] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const pathName = usePathname();
  const { data: session } = useSession();
  const router = useRouter;
  const userId = session?.user.id;

  // State variables to manage hover states for each icon
  const [copyHovered, setCopyHovered] = useState(false);
  const [shareHovered, setShareHovered] = useState(false);
  const [bookmarkHovered, setBookmarkHovered] = useState(false);

  // console.log(session, "session");

  // const handleBookmark = async () => {
  //   try {
  //     const res = await fetch("/api/bookmarks/add", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         promptId: prompt._id,
  //         userId: session?.user.id,
  //       }),
  //     });
  //     if (res.ok) {
  //       setIsBookmarked(true);
  //       toast.success("Prompt bookmarked");
  //     }
  //     if (res.status === 409) {
  //       toast.error("Prompt alreay bookmarked");
  //     }
  //   } catch (error) {
  //     console.error("Error bookmarking prompt:", error);
  //   }
  // };

  const handleBookmark = async () => {
    try {
      if (!session) {
        router.push("/login");
        return;
      }

      const res = await fetch("/api/bookmarks/toggle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          promptId: prompt._id,
          userId: session?.user.id,
        }),
      });

      if (res.ok) {
        if (res.status === 201) {
          // setIsBookmarked((prevState) => !prevState);
          // console.log(isBookmarked, "isBookmarked");
          onRemoveBookmark(prompt._id);
          toast.success("Prompt removed from bookmarks");
        } else {
          // setIsBookmarked(true);
          // setIsBookmarked((prevState) => !prevState);
          // console.log(isBookmarked, "isBookmarked");
          toast.success("Prompt bookmarked");
        }
        // console.log(isBookmarked, "isBookmarked");
        // fetchBookmarks();
      } else {
        const data = await res.json();
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      // console.error("Error bookmarking prompt:", error);
      toast.error("Failed to bookmark prompt");
    }
  };

  // const fetchBookmarks = async () => {
  //   try {
  //     if (!session || !session?.user) return;

  //     const response = await fetch(
  //       `/api/bookmarks/getBookmarks/${session?.user.id}`
  //     );
  //     const data = await response.json();
  //     // console.log(data, "data");
  //     // console.log(prompt._id, "prompt id");
  //     // setIsBookmarked(data.includes(prompt._id));
  //     // console.log(isBookmarked, "isBookmarked");
  //   } catch (error) {
  //     console.error("Error fetching bookmarks:", error);
  //   }
  // };

  // useEffect(() => {
  //   fetchBookmarks();
  // }, [userId]);

  return (
    <div className="prompt_card my-4">
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
          onClick={handleCopy}
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
          onClick={handleShare}
        >
          <Image
            src={
              sharePopup === true
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
        {session && (
          <div
            className="copy_btn relative"
            onMouseEnter={() => setBookmarkHovered(true)}
            onMouseLeave={() => setBookmarkHovered(false)}
            onClick={handleBookmark}
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
      </div>
      <Link
        href={`/single-prompt?id=${prompt._id}&pun=${prompt.creator.username}`}
      >
        <p className="my-4 font-satoshi text-sm text-gray-700">
          {prompt.promptText}
        </p>
      </Link>
      {/* <p className="my-4 font-satoshi text-sm text-gray-700">{prompt.result}</p> */}
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
  );
};

export default PromptCard;
