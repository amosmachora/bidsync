import { ControlProps } from "nuka-carousel";
import React from "react";

export const CustomBottomLeftControls = ({
  currentSlide,
  slideCount,
  nextSlide,
  previousSlide,
}: ControlProps) => {
  return (
    <div className="flex gap-x-5 absolute bottom-5 right-2 text-white text-sm justify-between">
      <svg
        width="89"
        height="18"
        viewBox="0 0 89 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        onClick={previousSlide}
        className="cursor-pointer"
      >
        <path
          d="M11.25 13.5L6.75 9L11.25 4.5"
          stroke="#E03636"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M8 9H88"
          stroke="#E03636"
          stroke-width="2"
          stroke-linecap="round"
        />
      </svg>
      <p>
        {currentSlide + 1} / {slideCount}
      </p>
      <svg
        className="cursor-pointer"
        onClick={nextSlide}
        width="89"
        height="18"
        viewBox="0 0 89 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M77.75 13.5L82.25 9L77.75 4.5"
          stroke="#E03636"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M1 9H81"
          stroke="#E03636"
          stroke-width="2"
          stroke-linecap="round"
        />
      </svg>
    </div>
  );
};
