"use client";

import { useState, useEffect } from "react";

import PromptCard from "./PromptCard";
import Link from "next/link";

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className="mt-16 prompt_layout">
      {data.map((item) => (
        <PromptCard
          key={item._id}
          prompt={item}
          handleTagClick={handleTagClick}
        />
      ))}
    </div>
  );
};

const Feed = () => {
  const [searchText, setSearchText] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [searchTimeOut, setSearchTimeOut] = useState(null);
  const [prompts, setPrompts] = useState([]);

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
    const fetchPrompts = async () => {
      const response = await fetch("/api/prompt");
      const data = await response.json();
      setPrompts(data.reverse());
    };
    fetchPrompts();
  }, []);

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
      {/* All Prompts */}
      {searchText ? (
        <PromptCardList data={searchResult} handleTagClick={handleTagClick} />
      ) : (
        <PromptCardList data={prompts} handleTagClick={handleTagClick} />
      )}
    </section>
  );
};

export default Feed;
