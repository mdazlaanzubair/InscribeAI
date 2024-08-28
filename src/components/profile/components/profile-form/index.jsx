import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { saveDataLocally } from "../../../../helpers";

// Validation schema with Yup
const schema = yup
  .object({
    name: yup.string().required("Name is required"),
    email: yup
      .string()
      .email("Invalid email address")
      .required("Email is required"),
    apiKey: yup.string().required("API Key is required"),
    resume: yup.string().required("Resume text is required"),
  })
  .required();

const ProfileForm = ({ data, changePage }) => {
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
      name: "",
      email: "",
      apiKey: "",
      resume: "",
    },
  });

  // FUNCTION TO SAVE DATA IN THE DATABASE AND LOCAL STORAGE
  const saveProfileData = (values) => {
    for (const [key, value] of Object.entries(values)) {
      saveDataLocally(key, value);
    }

    setTimeout(() => changePage(), 1500);
  };

  // PERFORMING SIDE EFFECT ON COMPONENT MOUNT TO
  // CHECK IF DATA IN LOCAL STORAGE EXIST
  useEffect(() => {
    if (data) {
      Object.keys(data).forEach((key) => setValue(key, data[key]));
      setIsShowKey(false);
    }
  }, [data]);

  return (
    <form
      onSubmit={handleSubmit(saveProfileData)}
      className="w-full grid grid-cols-2 gap-5 my-3"
    >
      <div className="flex flex-col">
        <input
          className={`input-box ${errors.name ? "border-red-500" : ""}`}
          placeholder="Full name"
          type="text"
          {...register("name")}
        />
        {errors.name && (
          <p className="text-red-500 text-xs">{errors.name.message}</p>
        )}
      </div>

      <div className="flex flex-col">
        <input
          className={`input-box ${errors.email ? "border-red-500" : ""}`}
          type="email"
          placeholder="Enter a valid email"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-red-500 text-xs">{errors.email.message}</p>
        )}
      </div>

      <div className="col-span-2 flex flex-row items-start justify-between gap-3">
        <div className="flex flex-col w-5/6">
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
          className="px-3 py-2 w-1/6 rounded-lg text-sm bg-slate-200 hover:bg-slate-300/70 hover:shadow-sm transition-colors duration-500 ease-in-out"
        >
          {isShowKey ? "Hide" : "Show"}
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
      <button
        onClick={reset}
        type="button"
        className="px-3 py-2 rounded-lg text-sm bg-slate-200 hover:bg-slate-300 hover:shadow-sm transition-colors duration-500 ease-in-out"
      >
        Reset
      </button>

      <button
        type="submit"
        className="px-3 py-2 rounded-lg text-white text-sm bg-blue-600 hover:bg-blue-800 hover:shadow-sm transition-colors duration-500 ease-in-out"
      >
        Save
      </button>
    </form>
  );
};

export default ProfileForm;
