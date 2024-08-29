import React, { useEffect, useState } from "react";
import { getLocalData, talkToGPT, talkToGemini } from "../../helpers";
import { Footer, Header, LetterDisplay, ModelSelector } from "./components";

const LetterGenerator = ({ toProfile }) => {
  const [data, setData] = useState({
    apiKey: "",
    resume: "",
    jobDesc: "",
    jobTitle: "",
    companyName: "",
    candidateName: "",
  });
  const [error, setError] = useState(null);
  const [letter, setLetter] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectAI, setSelectAI] = useState("GEMINI");

  // FUNCTION TO GENERATE COVER LETTER WITH THE HELP OF CHAT GTP
  // AND DISPLAY IT IN THE TEXTAREA FOR FURTHER EDITING
  const generateCoverLetter = async () => {
    // DESTRUCTURING VALUE OF ALL PARAMETERS FROM LOCAL STATE
    const { apiKey, resume, jobDesc, jobTitle, companyName } = data ?? null;

    // CHECKING IF ANY OF THE REQUIRED PARAMETER IS MISSING
    if (jobTitle && companyName && jobDesc && resume && apiKey && selectAI) {
      try {
        // TOGGLING LOADING STATE
        setIsLoading(true);

        // DYNAMIC PROMPT
        const prompt = `Write a personalized cover letter for a JOB TITLE: ${jobTitle} position at COMPANY NAME: ${companyName} based on the following JOB DESCRIPTION: ${jobDesc}. The candidate's RESUME DETAILS include ${resume}. Highlight the candidate's relevant skills, experiences, and accomplishments, and explain why they are a strong fit for this role. The tone should be professional yet enthusiastic, showing genuine interest in the company and the position. Remember while highlighting candidate's accomplishments, and experience try to quantify the statements so they can be grab the attention of hiring manager.`;

        // CALLING FUNCTION TO GENERATE COVER LETTER FROM GPT WITH REQUIRED PARAMETERS
        // BASED ON THE USER SELECTED MODEL
        const { error, coverLetter } =
          selectAI === "GEMINI"
            ? await talkToGemini(prompt, apiKey)
            : await talkToGPT(prompt, apiKey);

        // IF AI APIS FAILED WITH ERROR, SET IT IN THE LOCAL STATE TO DISPLAY IN UI
        if (error) {
          setError(error);
          return;
        }

        // ELSE SET THE RETURNED LETTER TO THE LOCAL STATE
        setError(null);
        setLetter(coverLetter);
      } catch (error) {
        // HANDLING UNFORESEEN ERRORS
        console.error("Error while generating the letter:", error.message);
      } finally {
        // TOGGLING LOADING STATE
        setIsLoading(false);
      }
    }
  };

  // PERFORMING SIDE EFFECT ON COMPONENT MOUNT TO GRAB THE JOB
  // DESCRIPTION FROM LOCAL STORAGE THAT IS SCRAPED BY BACKGROUND SCRIPT
  useEffect(() => {
    // FETCHING DATA FROM CHROME STORAGE ASYNCHRONOUSLY
    const fetchLocalStorage = async () => {
      // LOOPING THROUGH KEYS TO FETCH VALUES FROM LOCAL STORAGE
      const keys = Object.keys(data);
      const reqKeys = ["apiKey", "resume"];
      const localDataArr = await Promise.all(
        keys.map(async (key) => {
          const value = await getLocalData(key);
          // RETURNING KEY VALUE PAIRS TO CREATE OBJECT FROM ARRAY IN LINE 77
          return [key, value];
        })
      );

      // CONVERTING ARRAY INTO OBJECT
      const localDataObject = Object.fromEntries(localDataArr);

      // CHECKING IF THE REQUIRED FIELDS / USER INPUTS ARE EMPTY
      const isEmpty = reqKeys.some(
        (key) => !localDataObject[key] || localDataObject[key].length <= 0
      );

      if (isEmpty) {
        setData(null);
        toProfile();
        return;
      }

      setData((prev) => ({
        ...prev,
        ...localDataObject,
      }));
    };

    fetchLocalStorage();
  }, []);

  return (
    <>
      <div className="w-full flex flex-col gap-3">
        <Header candidateName={data?.candidateName} toProfile={toProfile} />
        <ModelSelector selectAI={selectAI} setSelectAI={setSelectAI} />
        {!isLoading && (
          <LetterDisplay
            error={error}
            letter={letter}
            jobTitle={data?.jobTitle}
            companyName={data?.companyName}
          />
        )}
        <Footer
            error={error}
            isLoading={isLoading}
          generateCoverLetter={generateCoverLetter}
          selectAI={selectAI}
          letter={letter}
        />
      </div>
    </>
  );
};

export default LetterGenerator;
