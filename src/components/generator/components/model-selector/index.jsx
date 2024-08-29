import React from "react";

const ModelSelector = ({ selectAI, setSelectAI }) => {
  return (
    <>
      <div className="flex text-sm items-center gap-3">
        <strong>Select AI Model:</strong>
        <div className="flex items-center gap-3">
          <label htmlFor="GEMINI">GEMINI by Google</label>
          <input
            id="GEMINI"
            name="selectAI"
            value="GEMINI"
            type="checkbox"
            onChange={(e) => e.target.checked && setSelectAI(e.target.value)}
            checked={selectAI === "GEMINI"}
          />
        </div>
        <div className="flex items-center gap-3">
          <label htmlFor="GPT">GPT by Open AI</label>
          <input
            id="GPT"
            name="selectAI"
            value="GPT"
            type="checkbox"
            onChange={(e) => e.target.checked && setSelectAI(e.target.value)}
            checked={selectAI === "GPT"}
          />
        </div>
      </div>
      <hr className="bg-slate-400" />
    </>
  );
};

export default ModelSelector;
