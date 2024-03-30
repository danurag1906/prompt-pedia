"use client";
import { useState, useEffect } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { Suspense } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { toast } from "react-hot-toast";

const SinglePrompt = () => {
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
      const response = await fetch(`/api/prompt/${promptId}`);
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

  const [copied, setCopied] = useState("");
  const [sharePopup, setSharePopup] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false); // State to track if prompt is liked

  const pathName = usePathname();
  const { data: session } = useSession();
  const router = useRouter();
  const userId = session?.user.id;

  // State variables to manage hover states for each icon
  const [copyHovered, setCopyHovered] = useState(false);
  const [shareHovered, setShareHovered] = useState(false);
  const [bookmarkHovered, setBookmarkHovered] = useState(false);

  // console.log(session, "session");

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
          promptId: promptId,
          userId: session?.user.id,
        }),
      });

      if (res.ok) {
        // console.log(res, "res");
        if (res.status === 201) {
          toast.success("Prompt removed from bookmarks");
          setIsBookmarked(false);
          if (pathName == "/get-bookmarks") {
            onRemoveBookmark(promptId);
          }
        } else {
          toast.success("Prompt bookmarked");
          setIsBookmarked(true);
        }
        fetchBookmarkStatus();
      } else {
        const data = await res.json();
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      toast.error("Failed to bookmark prompt");
    }
  };

  const fetchBookmarkStatus = async () => {
    try {
      const res = await fetch(`/api/bookmarks/status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          promptId: promptId,
          userId: userId,
        }),
      });
      const data = await res.json();
      setIsBookmarked(data.bookmarked);
    } catch (error) {
      toast.error("Error fetching bookmark status:");
    }
  };

  useEffect(() => {
    // console.log("indide useeffect");
    if (session) {
      fetchLikeCount(); // Fetch like count when component mounts
      fetchLikeStatus();
      fetchBookmarkStatus();
    }

    // }
  }, [session]);

  const fetchLikeCount = async () => {
    try {
      const res = await fetch(`/api/likes/count/${promptId}`);
      const data = await res.json();
      setLikeCount(data.likesCount);
    } catch (error) {
      console.error("Error fetching like count:", error);
    }
  };

  const fetchLikeStatus = async () => {
    try {
      const res = await fetch(`/api/likes/status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          promptId: promptId,
          userId: userId,
        }),
      });
      const data = await res.json();
      setIsLiked(data.isLiked);
    } catch (error) {
      console.error("Error fetching like status:", error);
    }
  };

  const handleLike = async () => {
    try {
      if (!session) {
        router.push("/login");
        return;
      }

      const res = await fetch("/api/likes/toggle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          promptId: promptId,
          userId: session?.user.id,
        }),
      });

      if (res.ok) {
        if (res.status == 201) {
          setIsLiked(false);
          toast.success("Prompt unliked");
        } else {
          setIsLiked(true);
          toast.success("Prompt liked");
        }

        fetchLikeCount();
        fetchLikeStatus();
      } else {
        const data = await res.json();
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      toast.error("Failed to toggle like");
    }
  };

  const handleCopy = () => {
    setCopied(prompt.promptText);
    navigator.clipboard.writeText(prompt.promptText);
    setTimeout(() => setCopied(""), 2000);
    toast.success("Prompt copied to clipboard");
  };

  const handleShare = () => {
    const url = `http://localhost:3000/single-prompt?id=${promptId}&pun=${profileUsername}`;
    navigator.clipboard.writeText(url);
    setSharePopup(true);
    setTimeout(() => setSharePopup(false), 2000);
    toast.success("Link copied to clipboard");
  };

  // console.log(prompt, "prompt");

  return (
    <Suspense>
      <section className="w-full mx-4 my-8">
        <div className="flex  flex-col gap-7 prompt_card_full">
          <div className="flex gap-4">
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
            {session && (
              <>
                <div className="copy_btn cursor-pointer " onClick={handleLike}>
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
    </Suspense>
  );
};

export default SinglePrompt;
