"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import Profile from "@components/Profile";
import Link from "next/link";
import Feed from "@components/Feed";

const MyProfile = () => {
  const [allPrompts, setAllPrompts] = useState([]);
  const router = useRouter();

  const { data: session } = useSession();
  //   console.log(session, "session");
  const handleEditFunc = async (prompt) => {
    router.push(`/update-prompt?id=${prompt._id}`);
  };

  const handleDeleteFunc = async (prompt) => {
    const hasConfirmed = confirm(
      "Are you sure you want to delete this prompt?"
    );
    if (hasConfirmed) {
      // console.log("inseide try");
      try {
        await fetch(
          `/api/prompt/${prompt._id.toString()}`,
          { cache: "no-store" },
          {
            method: "DELETE",
          }
        );
        fetchPrompts();
      } catch (error) {
        // console.log(error);
      }
    }
  };

  const fetchPrompts = async () => {
    //   console.log("insides fetch primpts");
    //   console.log(session?.user.id, "id");
    const response = await fetch(`/api/users/allPrompts/${session?.user.id}`, {
      cache: "no-store",
    });
    const data = await response.json();
    //   console.log(data, "data");
    setAllPrompts(data.reverse());
    //   console.log(allPrompts, "prompgts");
  };

  useEffect(() => {
    // console.log(session);
    if (session?.user.id) {
      //   console.log("inside if");
      fetchPrompts();
    }
  }, [session?.user.id]);

  // const removeBookmarkFunc = (promptId) => {
  //   setAllPrompts(allPrompts.filter((bookmark) => promptId !== bookmark._id));
  // };

  // console.log(allPrompts, "allPrompts");

  return (
    <>
      <Profile
        name={session?.user.email}
        desc="Private to you"
        data={allPrompts}
        handleEdit={handleEditFunc}
        handleDelete={handleDeleteFunc}
        // handleRemoveBookmark={removeBookmarkFunc}
      />
      {/* <Feed /> */}
    </>
  );
};

export default MyProfile;
