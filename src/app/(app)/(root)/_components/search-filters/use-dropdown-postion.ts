import { RefObject } from "react";

export const useDropdownRef = (
  ref: RefObject<HTMLDivElement | null> | RefObject<HTMLDivElement>,
) => {
  const getDropdownPosition = () => {
    if (!ref.current) return { top: 0, left: 0 };

    const rect = ref.current.getBoundingClientRect();
    const dropdownWidth = 240;

    // calculating inital position
    let left = rect.left + window.scrollX;
    const top = rect.bottom + window.scrollY;

    // if its overflowing to the right edge of viewport
    if (left + dropdownWidth > window.innerWidth) {
      // aliging to right edge position of button
      left = rect.right + window.scrollX - dropdownWidth;

      if (left < 0) {
        // if still overflowing, apply -16 padding
        left = window.innerWidth - dropdownWidth - 16;
      }
    }
    if (left < 0) {
      // Ensuring dropdown doesnt overflow to left with 16padding
      left = 16;
    }
    return { top, left };
  };

  return { getDropdownPosition };
};
