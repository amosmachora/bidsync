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
        className="w-20 aspect-square border border-dashed relative border-blue-500 cursor-pointer flex-shrink-0 hover:scale-105 transition-all duration-300"
        onClick={() => inputRef.current?.click()}
      >
        <FontAwesomeIcon
          icon={faPlus}
          className="h-5 w-5 text-blue-500 center-absolutely"
        />
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
