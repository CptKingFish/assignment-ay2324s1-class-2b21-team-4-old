import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  PaperClipIcon,
  DocumentIcon,
  PhotoIcon,
  VideoCameraIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/solid";
import { api } from "@/utils/api"

const Circle = () => {
  const [show, setShow] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const cardRef = React.useRef<HTMLDivElement>(null);
  const { mutateAsync: sendMessageMutation } = api.chat.sendMessage.useMutation();

  const handleToggle = () => {
    setShow(!show);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileList = Array.from(files);
      setSelectedFiles((prevSelectedFiles) => [
        ...prevSelectedFiles,
        ...fileList.slice(0, 5),
      ]);
    }
  };

  const handleUpload = () => {
    if (selectedFiles.length > 0) {
      // Perform upload logic here for each selected file
      selectedFiles.forEach((file) => {
        console.log("Uploading file:", file);
      });

      // Reset selected files after upload
      setSelectedFiles([]);
    }
  };


  React.useEffect(() => {
    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event: MouseEvent) => {
    if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
      setSelectedFiles([]);
    }
  };

  const buttonVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: 20, opacity: 0 },
  };

  const cardVariants = {
    hidden: { opacity: 0, zIndex: 0 },
    visible: (index) => ({
      opacity: 1,
      zIndex: selectedFiles.length - index,
      transition: {
        delay: index * 0.1, // Delay each card's entrance animation
      },
    }),
    hover: { zIndex: selectedFiles.length + 1 },
    exit: { opacity: 0 },
  };

  return (
    <div className="circle-container relative z-20">
      <div className="absolute bottom-full right-0 z-10 mt-[-2rem] rounded-full bg-transparent">
        {show && (
          <motion.div
            className="flex flex-col items-center space-y-4 pb-4 pt-2"
            initial="hidden"
            animate="visible"
            variants={buttonVariants}
          >
            <motion.div
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg ring-1 ring-gray-100 hover:bg-gray-200"
              variants={buttonVariants}
            >
              <label
                htmlFor="photo-upload"
                className="flex h-full w-full items-center justify-center focus:outline-none"
              >
                <input
                  type="file"
                  id="photo-upload"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  multiple
                />
                <PhotoIcon className="h-6 w-6" aria-hidden="true" />
              </label>
            </motion.div>
            <motion.div
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg ring-1 ring-gray-100 hover:bg-gray-200"
              variants={buttonVariants}
            >
              <label
                htmlFor="video-upload"
                className="flex h-full w-full items-center justify-center focus:outline-none"
              >
                <input
                  type="file"
                  id="video-upload"
                  accept="video/*"
                  onChange={handleFileChange}
                  className="hidden"
                  multiple
                />
                <VideoCameraIcon className="h-6 w-6" aria-hidden="true" />
              </label>
            </motion.div>
            <motion.div
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg ring-1 ring-gray-100 hover:bg-gray-200"
              variants={buttonVariants}
            >
              <label
                htmlFor="document-upload"
                className="flex h-full w-full items-center justify-center focus:outline-none"
              >
                <input
                  type="file"
                  id="document-upload"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                  multiple
                />
                <DocumentIcon className="h-6 w-6" aria-hidden="true" />
              </label>
            </motion.div>
          </motion.div>
        )}
      </div>
      <button
        className="flex items-center justify-center rounded-full p-2 text-gray-700 focus:outline-none"
        onClick={handleToggle}
      >
        <PaperClipIcon className="h-6 w-6" />
      </button>

          <div>
      <div className="absolute w-80 translate-x-[16rem] -translate-y-[27rem] bg-slate-500 rounded-lg bg-transparent">
        <AnimatePresence>
          {selectedFiles.map((file, index) => (
            <motion.div
              key={index}
              className="card"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              whileHover="hover"
              custom={index}
              ref={cardRef}
            >
              {file.type.includes("image") ? (
                <figure className="px-10 pt-10 flex flex-col">
                  <Image
                    src={URL.createObjectURL(file)}
                    alt="Selected File"
                    width={300} // Set your desired width for the image
                    height={200} // Set your desired height for the image
                    className="rounded-xl"
                  />
                  <span className="font-bold">{file.name}</span>
                </figure>
              ) : file.type.includes("video") ? (
                <figure className="px-10 pt-10 flex flex-col">
                  <video
                    src={URL.createObjectURL(file)}
                    controls
                    className="rounded-xl"
                    width={300} // Set your desired width for the video
                    height={200} // Set your desired height for the video
                  />
                  <span className="font-bold">{file.name}</span>
                </figure>
              ) : (
                <div className="card-body items-center text-center">
                  <DocumentTextIcon className="h-10 w-10" />
                  <span className="font-bold">{file.name}</span>
                </div>
              )}
              <button className="btn-primary btn my-4 mx-2" onClick={handleUpload}>
                Upload
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
    </div>
  );
};

export default Circle;
