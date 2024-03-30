"use client";

import { useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

const PromptCard = ({
  prompt,
  handleTagClick,
  onHandleEdit,
  onHandleDelete,
}) => {
  const handleCopy = () => {
    setCopied(prompt.promptText);
    navigator.clipboard.writeText(prompt.promptText);
    setTimeout(() => setCopied(""), 3000);
  };

  const [copied, setCopied] = useState("");
  const pathName = usePathname();
  const { data: session } = useSession();
  const router = useRouter;
  // console.log(session, "session");

  return (
    <div className="prompt_card my-4">
      <div className="flex justify-between items-start gap-5">
        <div className="flex-1 flex justify-start items-center gap-3 cursor-pointer">
          <Link
            href={`/profile/unique?profileId=${prompt.creator._id}&profileUsername=${prompt.creator.username}`}
          >
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
        <div className="copy_btn" onClick={handleCopy}>
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
        </div>
      </div>
      <Link
        href={`/single-prompt?id=${prompt._id}&profileUsername=${prompt.creator.username}`}
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
