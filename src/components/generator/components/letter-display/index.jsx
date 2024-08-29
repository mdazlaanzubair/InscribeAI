import React from "react";

const LetterDisplay = ({ error, letter, jobTitle, companyName }) => {
  return (
    <div className="col-span-2 text-sm flex flex-col gap-3">
      {letter?.length > 0 && !error && (
        <>
          <strong className="pl-1 pt-3 opacity-70">
            Cover Letter for{" "}
            <strong>
              {`${jobTitle} `}
              <span className="text-blue-600">{`@${companyName}`}</span>
            </strong>
          </strong>
          <textarea
            className="input-box"
            placeholder="Your cover letter goes here..."
            rows="5"
          >
            {letter}
          </textarea>
        </>
      )}
      {error && (
        <strong className="text-xs text-red-500 pl-1 pt-3 opacity-70">
          {error}
        </strong>
      )}
    </div>
  );
};

export default LetterDisplay;
