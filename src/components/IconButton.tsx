import React from "react";

type Props = {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
};

const IconButton = ({ children, className, ...props }: Props) => {
  return (
    <button
      className={`flex h-8 w-8 items-center justify-center rounded-full bg-transparent transition-all hover:bg-gray-200 ${
        className ?? ""
      }`}
      {...props}
    >
      {children}
    </button>
  );
};

export default IconButton;
