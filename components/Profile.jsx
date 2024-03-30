"use client";
import Link from "next/link";
import PromptCard from "./PromptCard";

const Profile = ({ name, desc, data, handleEdit, handleDelete }) => {
  // console.log(data, "data");
  return (
    <section className="w-full">
      <h1 className="text-xl font-bold text-left">
        <span className="blue_gradient">{name} </span>
        Profile
      </h1>
      <p className="my-2">
        you might get random numbers for username at the end to avoid
        duplication
      </p>
      {/* <p className="desc text-left">{desc}</p> */}
      <div className="mt-16 prompt_layout">
        {data &&
          data.map((promptItem) => (
            <PromptCard
              key={promptItem._id}
              prompt={promptItem}
              onHandleEdit={() => handleEdit && handleEdit(promptItem)}
              onHandleDelete={() => handleDelete && handleDelete(promptItem)}
            />
          ))}
      </div>
    </section>
  );
};

export default Profile;
