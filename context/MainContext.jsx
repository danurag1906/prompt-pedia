"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";

// Create a context
const MainContext = createContext();

// Custom hook to use the context
export const useMainContext = () => {
  return useContext(MainContext);
};

// MainContextProvider component
export const MainContextProvider = ({ children }) => {
  //   const router = useRouter();

  // States
  const [searchText, setSearchText] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [searchTimeOut, setSearchTimeOut] = useState(null);
  const [prompts, setPrompts] = useState([]);
  const [copied, setCopied] = useState("");
  const [sharePopup, setSharePopup] = useState({});
  const [isBookmarked, setIsBookmarked] = useState({});
  const [user, setUser] = useState(null);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [feedLoading, setFeedLoading] = useState(false);
  const [likeCount, setLikeCount] = useState({});
  const [isLiked, setIsLiked] = useState({});

  // Functions
  const handleBookmark = async (promptid, userId) => {
    try {
      // Your implementation

      // console.log(userId, promptid);
      if (!userId) {
        // console.log("no user hanldeBookmark");
        router.push("/login");
        return;
      }

      const res = await fetch("/api/bookmarks/toggle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          promptId: promptid,
          userId: userId,
        }),
      });
      if (res.ok) {
        // Handle success
        if (res.status === 201) {
          //   if (pathName == "/get-bookmarks") {
          //     setPrompts((prompts) =>
          //       prompts.filter((prompt) => prompt._id !== promptid)
          //     );
          //   }
          toast.success("Prompt removed from bookmarks");
          setIsBookmarked((prev) => ({
            ...prev,
            [promptid]: false,
          }));
        } else {
          toast.success("Prompt bookmarked");
          setIsBookmarked((prev) => ({
            ...prev,
            [promptid]: true,
          }));
        }
        fetchBookmarkStatus(userId);
      } else {
        const data = await res.json();
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      toast.error("Failed to bookmark prompt");
    }
  };

  const fetchBookmarkStatus = async (userid) => {
    try {
      // console.log("bookmark status called");
      // console.log(userid, "user");
      // console.log(user?._id, "uuserId");
      // Your implementation
      if (userid != null) {
        const res = await fetch(`/api/bookmarks/status`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userid,
          }),
        });
        const data = await res.json();
        // Update isBookmarked state
        const initialBookmarks = data.bookmarks.reduce((acc, item) => {
          return { ...acc, [item]: true };
        }, {});
        setIsBookmarked(initialBookmarks);
        // console.log(isBookmarked, "isbookmarked");
      }
    } catch (error) {
      toast.error("Error fetching bookmark status:", error);
    }
  };

  const fetchLikeCount = async (promptid) => {
    try {
      const res = await fetch(`/api/likes/count/${promptid}`);
      const data = await res.json();
      setLikeCount((prevCount) => ({
        ...prevCount,
        [promptid]: data.likesCount,
      }));
      // console.log(likeCount, "setlikecount");
    } catch (error) {
      // console.error("Error fetching like count:", error);
      toast.error("Error fetching like count:", error);
    }
  };

  const fetchLikeStatus = async (promptid, userId) => {
    try {
      if (userId != null) {
        const res = await fetch(`/api/likes/status`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            promptId: promptid,
            userId: userId,
          }),
        });
        const data = await res.json();
        setIsLiked((prevLiked) => ({
          ...prevLiked,
          [promptid]: data.isLiked,
        }));
        // console.log(isLiked, "setisliked");
      }
    } catch (error) {
      // console.error("Error fetching like status:", error);
      toast.error("Error fetching like status:", error);
    }
  };

  const handleLike = async (promptid, userid) => {
    // console.log("handleLike called", promptid);
    // console.log("handleLike called", userid);
    try {
      if (!userid) {
        // console.log("no user");
        router.push("/login");
        return;
      }
      const res = await fetch("/api/likes/toggle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          promptId: promptid,
          userId: userid,
        }),
      });
      if (res.ok) {
        if (res.status == 201) {
          setIsLiked((prevData) => ({
            ...prevData,
            [promptid]: false,
          }));
          toast.success("Prompt unliked");
        } else {
          setIsLiked((prevData) => ({
            ...prevData,
            [promptid]: true,
          }));
          toast.success("Prompt liked");
        }
        fetchLikeCount(promptid);
        // fetchLikeStatus(promptid);
        // fetchUser();
      } else {
        const data = await res.json();
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      toast.error("Failed to toggle like");
    }
  };

  const handleCopy = (promptText) => {
    setCopied(promptText);
    navigator.clipboard.writeText(promptText);
    setTimeout(() => setCopied(""), 2000);
    toast.success("Prompt copied to clipboard");
  };

  const handleShare = (promptid, creatorname) => {
    const url = `https://findprompts.vercel.app/single-prompt?id=${promptid}&pun=${creatorname}`;
    navigator.clipboard.writeText(url);
    setSharePopup((prev) => ({
      ...prev,
      [promptid]: true,
    }));
    setTimeout(() => setSharePopup(false), 2000);
    toast.success("Link copied to clipboard");
  };

  const filterPrompts = (searchText) => {
    const regex = new RegExp(searchText, "i");
    return prompts.filter(
      (item) =>
        regex.test(item.promptText) ||
        regex.test(item.creator.username) ||
        regex.test(item.tagLine)
    );
  };

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeOut);
    setSearchText(e.target.value);
    setSearchTimeOut(
      setTimeout(() => {
        const searchResult = filterPrompts(e.target.value);
        setSearchResult(searchResult);
      }, 100)
    );
  };

  const handleTagClick = (tagLine) => {
    setSearchText(tagLine);
    const searchResult = filterPrompts(tagLine);
    setSearchResult(searchResult);
  };

  useEffect(() => {
    // Fetch data or perform any initialization logic here
    // const { data: session } = useSession();
    // setUser(session?.user);
  }, []);

  // Value to be provided by the context
  const contextValue = {
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
  };

  return (
    <MainContext.Provider value={contextValue}>{children}</MainContext.Provider>
  );
};
