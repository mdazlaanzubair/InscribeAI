import { LetterGenerator, ProfileContainer } from "./components";
import appLogoFull from "./assets/logo-full.png";
import { useEffect, useState } from "react";
import { getLocalData } from "./helpers";

function App() {
  const [activePage, setActivePage] = useState("profile");
  const [userData, setUserData] = useState(null);

  // PERFORMING SIDE EFFECT ON COMPONENT MOUNT TO DECIDE WHICH
  // COMPONENT TO RENDER ON UI BASED ON LOCAL STORAGE VALUE
  useEffect(() => {
    // FETCHING DATA FROM CHROME STORAGE ASYNCHRONOUSLY
    const fetchLocalStorage = async () => {
      const keys = ["name", "email", "apiKey", "resume"];

      // USING for...of LOOP TO await EACH ASYNC TASK
      for (const key of keys) {
        // STORING ASYNC VALUE IN SEPARATE VARIABLE
        const value = await getLocalData(key);

        // CHECKING IF THE VALUE IS WELL DEFINED
        // UPDATE THE VALUE IN LOCAL COMPONENT STATE
        // ELSE: BREAK OUT FROM LOOP IF A SINGLE VALUE IS
        // MISSING AND REDIRECT TO PROFILE PAGE
        if (value && value?.length > 0) {
          setUserData((prev) => ({
            ...prev,
            [key]: value,
          }));
          activePage !== "generator" && setActivePage("generator");
        } else {
          setUserData(null);
          setActivePage("profile");
          break;
        }
      }

      return userData;
    };

    fetchLocalStorage();
  }, []);

  // OBJECT TO HOLD LIST OF COMPONENTS TO BE RENDERED
  const componentsHolder = {
    generator: (
      <LetterGenerator
        data={userData}
        changePage={() => setActivePage("profile")}
      />
    ),

    profile: (
      <ProfileContainer
        data={userData}
        changePage={() => setActivePage("generator")}
      />
    ),
  };

  return (
    <main className="flex flex-col w-[600px] h-fit overflow-hidden items-center justify-center bg-[#f5f5f5] p-5 rounded-lg shadow-lg shadow-gray-200">
      <img
        className="w-1/2 mx-auto h-10 my-3 bg-blue-600"
        src={appLogoFull}
        alt="app-logo"
        srcSet="app-logo"
      />

      {componentsHolder[activePage]}
    </main>
  );
}

export default App;
