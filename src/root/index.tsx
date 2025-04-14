import Dashboard from "../components/Dashboard";
import ModalBlock from "../components/ModalBlock";
import { Toaster } from "sonner";
import UserNamePrompt from "../components/UserNamePrompt";
import { useState } from "react";

const Root = () => {
  const [userName, setUserName] = useState(
    sessionStorage.getItem("userDashName") || ""
  );

  const handleNameSubmit = (name: string) => {
    setUserName(name);
  };
  return (
    <>
      <Toaster position="top-right" />
      <ModalBlock />
      {userName ? (
        <Dashboard />
      ) : (
        <UserNamePrompt onSubmit={handleNameSubmit} />
      )}
    </>
  );
};

export default Root;
