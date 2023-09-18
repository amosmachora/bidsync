import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChangeEvent, useRef } from "react";

export const UploadButton = ({
  addFileFunction,
}: {
  addFileFunction: (file: File) => void;
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFileFunction(e.target.files[0]);
      inputRef.current!.value = "";
    }
  };

  return (
    <>
      <div
        className="w-28 rounded-md h-20 border border-dashed relative border-[#E03636] cursor-pointer flex-shrink-0 hover:scale-105 transition-all duration-300 text-xs flex items-center justify-center px-5"
        onClick={() => inputRef.current?.click()}
      >
        <svg
          width="25"
          height="25"
          viewBox="0 0 25 25"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="mr-2"
        >
          <path
            d="M21.5 14.75V20C21.5 20.3978 21.342 20.7794 21.0607 21.0607C20.7794 21.342 20.3978 21.5 20 21.5H5C4.60218 21.5 4.22064 21.342 3.93934 21.0607C3.65804 20.7794 3.5 20.3978 3.5 20V14.75C3.5 14.5511 3.57902 14.3603 3.71967 14.2197C3.86032 14.079 4.05109 14 4.25 14C4.44891 14 4.63968 14.079 4.78033 14.2197C4.92098 14.3603 5 14.5511 5 14.75V20H20V14.75C20 14.5511 20.079 14.3603 20.2197 14.2197C20.3603 14.079 20.5511 14 20.75 14C20.9489 14 21.1397 14.079 21.2803 14.2197C21.421 14.3603 21.5 14.5511 21.5 14.75ZM9.28063 8.53064L11.75 6.06032V14.75C11.75 14.9489 11.829 15.1397 11.9697 15.2803C12.1103 15.421 12.3011 15.5 12.5 15.5C12.6989 15.5 12.8897 15.421 13.0303 15.2803C13.171 15.1397 13.25 14.9489 13.25 14.75V6.06032L15.7194 8.53064C15.8601 8.67137 16.051 8.75043 16.25 8.75043C16.449 8.75043 16.6399 8.67137 16.7806 8.53064C16.9214 8.3899 17.0004 8.19903 17.0004 8.00001C17.0004 7.80099 16.9214 7.61012 16.7806 7.46938L13.0306 3.71939C12.961 3.64965 12.8783 3.59433 12.7872 3.55659C12.6962 3.51885 12.5986 3.49942 12.5 3.49942C12.4014 3.49942 12.3038 3.51885 12.2128 3.55659C12.1217 3.59433 12.039 3.64965 11.9694 3.71939L8.21937 7.46938C8.07864 7.61012 7.99958 7.80099 7.99958 8.00001C7.99958 8.19903 8.07864 8.3899 8.21937 8.53064C8.36011 8.67137 8.55098 8.75043 8.75 8.75043C8.94902 8.75043 9.13989 8.67137 9.28063 8.53064Z"
            fill="#2D2B2B"
          />
        </svg>
        <p className="mx-auto">Upload Image</p>
      </div>
      <input
        type="file"
        name="file-input"
        id="file-input"
        ref={inputRef}
        onChange={handleInputChange}
        hidden
      />
    </>
  );
};
