import React from "react";

type Props = {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

const IconButton = ({ children, ...props }: Props) => {
  return (
    <button
      className="flex h-8 w-8 items-center justify-center rounded-full bg-transparent transition-all hover:bg-gray-200"
      {...props}
    >
      {children}
    </button>
  );
};

export default IconButton;
