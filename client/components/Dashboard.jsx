import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useDispatch } from "react-redux";
import { fetchMessages } from "../state/ducks/messages";

import Navigation from "./Navigation";
import Sidebar from "./Sidebar";
import BoardNavigation from "./BoardNavigation";
import Chat from "./Chat";
import Footer from "./Footer";
import AddChannel from "./AddChannel";
import AddTeamMembers from "./AddTeamMember";
import MemberList from "./MemberList";
import EditProfile from "./EditProfile";

function Dashboard() {
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const { team, channel } = useParams();
  const [addChannel, setAddChannel] = useState(false);
  const [addMember, setAddMember] = useState(false);
  const messageEnd = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleFetch = async () => {
      if (channel) {
        await dispatch(
          fetchMessages(`/api/channels/${channel}/messages`, "GET", "READ")
        );
        dispatch({ type: "STORE_JOIN", channel });
        messageEnd.current.scrollIntoView({ behavior: "smooth" });
      }
    };
    handleFetch();
  }, [team, channel]);

  return (
    <div className="h-screen">
      <Navigation />
      <div className="h-dashboard">
        <Helmet>
          <title>Dashboard</title>
        </Helmet>
        <div className="flex flex-row h-full">
          <Sidebar
            setChannel={setAddChannel}
            setMember={setAddMember}
            team={team}
          />
          <div className="flex flex-col w-dashboard pl-4" id="dashboard">
            <BoardNavigation setIsOpen={setIsOpen} />
            <Chat setIsEdit={setIsEdit} messageEnd={messageEnd} />
            <Footer channel={channel} messageEnd={messageEnd} />
          </div>
        </div>
        {isOpen && <MemberList isOpen={isOpen} setIsOpen={setIsOpen} />}
        {isEdit && <EditProfile isOpen={isEdit} setIsOpen={setIsEdit} />}
        {addMember && (
          <AddTeamMembers isOpen={addMember} setIsOpen={setAddMember} />
        )}
        {addChannel && (
          <AddChannel
            team={team}
            isOpen={addChannel}
            setIsOpen={setAddChannel}
          />
        )}
      </div>
    </div>
  );
}

export default Dashboard;
