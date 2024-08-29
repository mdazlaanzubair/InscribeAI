import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  getLocalData,
  removeLocalData,
  saveDataLocally,
} from "../../../../helpers";

// FORM VALIDATION
const schema = yup
  .object()
  .shape({
    apiKey: yup.string().required("API Key is required"),
    resume: yup.string().required("Resume is required"),
  })
  .required();

const ProfileForm = ({ toGenerator }) => {
  const [isShowKey, setIsShowKey] = useState(false);

  // INITIALIZING FORM WITH VALIDATION SCHEMA
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      apiKey: "",
      resume: "",
    },
  });

  // WATCHING CHANGE IN FORM FIELDS
  const { apiKey, resume } = watch();
  const [isLoading, setIsLoading] = useState(false);

  // FUNCTION TO SAVE DATA IN THE DATABASE AND LOCAL STORAGE
  const saveProfileData = async (values) => {
    setIsLoading(true);
    await saveDataLocally("apiKey", values?.apiKey);
    await saveDataLocally("resume", values?.resume);

    setTimeout(() => {
      toGenerator();
      setIsLoading(false);
    }, 1500);
  };

  // FUNCTION TO RESET ALL USER DATA
  const resetUserData = () => {
    // RESETTING FORM TO INITIAL VALUE
    reset({
      apiKey: "",
      resume: "",
    });

    // REMOVING USER DATA FROM LOCAL STORAGE TOO
    // IT WILL ONLY REMOVE USER PROVIDED VALUE
    removeLocalData();
  };

  // PERFORMING SIDE EFFECT ON COMPONENT MOUNT TO
  // CHECK IF DATA IN LOCAL STORAGE EXIST
  useEffect(() => {
    // FETCHING DATA FROM CHROME STORAGE ASYNCHRONOUSLY
    const fetchLocalStorage = async () => {
      const apiKey = await getLocalData("apiKey");
      const resume = await getLocalData("resume");

      setValue("apiKey", apiKey);
      setValue("resume", resume);
    };

    fetchLocalStorage();
  }, []);

  // PERFORMING SIDE EFFECT ON FIELDS VALUE CHANGE
  // AND STORE VALUES IN STORAGE IN REALTIME
  useEffect(() => {
    const saveRealtimeDataLocally = async (key, value) => {
      if (value?.length > 10) {
        await saveDataLocally(key, value);
      }
    };

    saveRealtimeDataLocally("apiKey", apiKey);
    saveRealtimeDataLocally("resume", resume);
  }, [apiKey, resume]);

  return (
    <form
      onSubmit={handleSubmit(saveProfileData)}
      className="w-full flex flex-col gap-5"
    >
      <div className="flex flex-row items-start justify-between gap-3">
        <div className="flex flex-col flex-grow">
          <input
            className={`input-box ${errors.apiKey ? "border-red-500" : ""}`}
            type={isShowKey ? "text" : "password"}
            placeholder="Enter your secret key"
            {...register("apiKey")}
          />
          {errors.apiKey && (
            <p className="text-red-500 text-xs">{errors.apiKey.message}</p>
          )}
        </div>
        <button
          type="button"
          onClick={() => setIsShowKey(!isShowKey)}
          className="p-[0.38rem] rounded-lg text-sm bg-slate-200 hover:bg-slate-300/70 hover:shadow-sm transition-colors duration-500 ease-in-out"
        >
          {isShowKey ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
          )}
        </button>
      </div>

      <div className="flex flex-col col-span-2">
        <textarea
          className={`input-box ${errors.resume ? "border-red-500" : ""}`}
          placeholder="Paste resume text here..."
          rows="8"
          {...register("resume")}
        />
        {errors.resume && (
          <p className="text-red-500 text-xs">{errors.resume.message}</p>
        )}
      </div>

      <div className="flex items-center justify-end gap-3">
        <button
          disabled={isLoading}
          type="submit"
          className="px-3 py-2 w-fit flex gap-2 items-center justify-center rounded-lg text-white text-sm bg-blue-600 hover:bg-blue-800 hover:shadow-sm transition-colors duration-500 ease-in-out"
        >
          {isLoading && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-4 animate-spin"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
          )}

          <span>{`${isLoading ? "Saving" : "Save"}`}</span>
        </button>
        <button
          onClick={resetUserData}
          type="button"
          className="px-3 py-2 w-20 rounded-lg text-sm bg-slate-200 hover:bg-slate-300 hover:shadow-sm transition-colors duration-500 ease-in-out"
        >
          Reset
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;
