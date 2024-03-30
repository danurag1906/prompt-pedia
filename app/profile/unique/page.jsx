"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Profile from "@components/Profile";

const MyProfile = () => {
  const [allPrompts, setAllPrompts] = useState([]);
  const [user, setUser] = useState("");

  const searchParams = useSearchParams();
  const profileId = searchParams.get("pid");

  // console.log(profileId, promptUsername);

  const fetchPrompts = async () => {
    //   console.log("insides fetch primpts");
    //   console.log(session?.user.id, "id");
    const response = await fetch(`/api/users/allPrompts/${profileId}`);
    const data = await response.json();
    //   console.log(data, "data");
    setAllPrompts(data.reverse());
    //   console.log(allPrompts, "prompgts");
  };

  const fetchProfile = async () => {
    const response = await fetch(`/api/users/${profileId}`);
    const data = await response.json();
    const username = await data[0].username;
    setUser(username);
  };

  useEffect(() => {
    // console.log(session);
    if (profileId) {
      //   console.log("inside if");
      fetchPrompts();
      fetchProfile();
    }
  }, [profileId]);

  return (
    <Suspense>
      <Profile name={user} data={allPrompts} />
    </Suspense>
  );
};

export default MyProfile;
