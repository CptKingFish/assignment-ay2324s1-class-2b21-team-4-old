import React, {  useState } from "react";
import IconButton from "./IconButton";
import Dropzone from "react-dropzone";
import { IUser } from "@/models/User";
import { api } from "@/utils/api";
import { toast } from "react-hot-toast";

const convertBase64= (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      resolve(fileReader.result as string);
    };

    fileReader.onerror = (error) => { 
      reject(error);
    };
  });
};

const convertFileSize = (bytes: number) => {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "0 Byte";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${Math.round(bytes / Math.pow(1024, i))} ${sizes[i] ?? ""}`;
};

const ProjectFiles = ({ users }: { users: IUser[] }): JSX.Element => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const { mutate } = api.image.uploadImages.useMutation();

  const onHandleSubmit = async (files: File[]): Promise<void> => {
    try {
      const parray: Promise<string>[] = [];
      for (const file of files) {
        parray.push(convertBase64(file));
      }
      const allFilesB64 = await Promise.all(parray);
      const input = {
        images: allFilesB64
      };

      mutate(input, {
        onSuccess: (data) => {
          toast.success("Upload successfully!");
          console.log(data);
        },
        onError: (error) => {
          toast.error("Upload failed!");
          console.log(error);
        }
      });
    } catch (error) {
      console.log("handle upload error:", error);
    }
  };
  
  return (
    <div className="mt-4">
      <div className="flex gap-4">
        <Dropzone
          onDrop={(acceptedFiles) => {
            console.log(acceptedFiles);
            setUploadedFiles([...uploadedFiles, ...acceptedFiles]);
          
          }}
          maxSize={10 * 1024 * 1024} 
        >
          {({ getRootProps, getInputProps }) => (
            <section>
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <button className="btn-sm btn flex items-center justify-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                  Upload
                </button>
              </div>
            </section>
          )}
        </Dropzone>
        {uploadedFiles.length > 0 && (
          <>
            <button
              className="btn-success btn-sm btn"
              onClick={() => onHandleSubmit(uploadedFiles)}
            >
              Submit!
            </button>
            <button
              className="btn-info btn-sm btn"
              onClick={() => setUploadedFiles([])}
            >
              Clear
            </button>
          </>
        )}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {uploadedFiles.map((file) => (
          <div key={file.name} className="border border-gray-200 p-2">
            <div>{file.name}</div>
            <div className="text -gray-500 text-xs">
              {convertFileSize(file.size)}
            </div>
          </div>
        ))}
      </div>
      <table className="mt-4 table w-full">
        <thead>
          <tr>
            <th>Name</th>
            <th>Author</th>
            <th>Modified</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => {
            const user = users.find(
              (user) => user._id.toString() === file.author
            );
            if (!user) return null;
            return (
              <tr key={file.id}>
                <td>                
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-6 w-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 13.5l3 3m0 0l3-3m-3 3v-6m1.06-4.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
                      />
                    </svg>

                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {file.name}
                    </a>
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-4">
                    <div className="avatar">
                      {!user.avatar ? (
                        <div className="placeholder avatar" key={user._id}>
                          <div
                            className="justiy-center w-6 items-center rounded-full bg-neutral-focus text-neutral-content"
                            style={{ lineHeight: "1.5rem" }}
                          >
                            <span className="m-0 p-0 text-xl">
                              {user.username[0]}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="h-12 w-12 rounded-md">
                          <img
                            src={user?.avatar}
                            alt="Avatar Tailwind CSS Component"
                          />
                        </div>
                      )}
                    </div>
                    <span className="text-md font-semibold text-gray-500">
                      {user.username}
                    </span>
                  </div>
                </td>
                <td className="text-gray-500">
                  {new Date(file.timestamp).toLocaleDateString()}
                </td>
                <td>
                  <div className="flex items-center  gap-2">
                    <IconButton>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-6 w-6 text-red-600"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14
                      .74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                        />
                      </svg>
                    </IconButton>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectFiles;
