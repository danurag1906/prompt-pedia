"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import Profile from "@components/Profile";

const MyProfile = () => {
  const [allPrompts, setAllPrompts] = useState([]);

  const searchParams = useSearchParams();
  const profileId = searchParams.get("profileId");
  const promptUsername = searchParams.get("profileUsername");
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

  useEffect(() => {
    // console.log(session);
    if (profileId) {
      //   console.log("inside if");
      fetchPrompts();
    }
  }, [profileId]);

  return <Profile name={`${promptUsername}`} data={allPrompts} />;
};

export default MyProfile;
