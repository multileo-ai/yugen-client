import React from "react";
import ProfileLeftTab from "../Components/ProfileLeftTab";
import CommunityChat from "../Components/CommunityChat";

const Profile = () => {
  return (
    <div className="flex">
      <ProfileLeftTab />
      <CommunityChat />
    </div>
  );
};

export default Profile;
