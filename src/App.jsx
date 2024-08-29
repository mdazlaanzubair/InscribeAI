import { useState } from "react";
import { LetterGenerator, ProfileContainer } from "./components";

function App() {
  const [activePage, setActivePage] = useState("generator");

  // FUNCTION TO CHANGE PAGE BASED ON PARAMETER
  const switchToProfile = () => setActivePage("profile");
  const switchToGenerator = () => setActivePage("generator");

  // OBJECT TO HOLD LIST OF COMPONENTS TO BE RENDERED
  const componentsHolder = {
    generator: <LetterGenerator toProfile={switchToProfile} />,
    profile: <ProfileContainer toGenerator={switchToGenerator} />,
  };

  return (
    <main className="flex flex-col w-[600px] h-fit overflow-hidden items-center justify-center bg-[#f5f5f5] p-5 rounded-lg shadow-lg shadow-gray-200">
      {/* <img
        className="w-1/2 mx-auto h-10 my-3 bg-blue-600"
        src={appLogoFull}
        alt="app-logo"
        srcSet="app-logo"
      /> */}

      {componentsHolder[activePage]}
    </main>
  );
}

export default App;
