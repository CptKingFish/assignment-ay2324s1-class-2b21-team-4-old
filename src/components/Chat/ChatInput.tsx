import React from "react";
import { toast } from "react-hot-toast";
import { api } from "@/utils/api";
import { AnimatePresence, motion } from "framer-motion";
import { Message, PendingMessage } from "@/utils/chat";
import IconButton from "../IconButton";
import { Loader2, X } from "lucide-react";
import Circle from "@/components/Circle";
import { Previews } from "@/components/Dropzone";
import mongoose from "mongoose";
import { useGlobalContext } from "@/context";
import useLogger from "@/hooks/useChangeLog";

interface ChatInputProps {
  channelCode: string;
  replyTo: Message | null;
  setReplyTo: React.Dispatch<React.SetStateAction<Message | null>>;
  addPendingMessage: (message: PendingMessage) => void;
  setPendingMessageHasFailed: (message_id: string) => void;
  messages: Message[];
}

const ChatInput = ({
  channelCode,
  replyTo,
  setReplyTo,
  addPendingMessage,
  setPendingMessageHasFailed,
  messages,
}: ChatInputProps) => {
  const { user } = useGlobalContext();
  const { mutate: autoComplete, isLoading: isCompleting } =
    api.chat.getAutoCompleteTexts.useMutation();
  const [input, setInput] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [aiOptions, setAiOptions] = React.useState<string[]>([]);
  const { mutateAsync: sendMessageMutation } =
    api.chat.sendMessage.useMutation();

  const sendMessage = async (input: string) => {
    if (!input || isLoading) return;
    setIsLoading(true);

    try {
      console.log("sending message");
      const _id = new mongoose.Types.ObjectId();

      if (replyTo) {
        addPendingMessage({
          _id: _id.toString(),
          name: user?.username as string,
          avatarUrl: "https://source.unsplash.com/random/?city,night",
          text: input,
          hasFailed: false,
          hasReplyTo: true,
          replyTo: {
            username: replyTo.sender.username,
            text: replyTo.text,
          },
        });
        await sendMessageMutation({
          _id: _id.toString(),
          channel: channelCode,
          text: input,
          replyTo: {
            _id: replyTo._id as unknown as string,
            text: replyTo.text,
            sender: {
              _id: replyTo.sender._id as unknown as string,
              username: replyTo.sender.username,
            },
            timestamp: new Date().getTime(),
          },
        });
      } else {
        // const _id = new mongoose.Types.ObjectId();

        addPendingMessage({
          _id: _id.toString(),
          name: user?.username as string,
          avatarUrl: "https://source.unsplash.com/random/?city,night",
          text: input,
          hasFailed: false,
          hasReplyTo: false,
        });

        await sendMessageMutation(
          {
            _id: _id.toString(),
            channel: channelCode,
            text: input,
          },
          {
            onError: (err) => {
              console.log(err);
              setPendingMessageHasFailed(_id.toString());
            },
          }
        );
      }

      setInput("");
      setReplyTo(null);
    } catch (e) {
      console.log(e);

      toast.error("Something went wrong. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const uploadImage = () => {
    console.log("uploadImage");

    // Add your image upload logic here
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // console.log(e.key);

    if (e.key === "Enter") {
      e.preventDefault();
      void sendMessage(input);
    }
    if (e.key === "Escape") {
      setReplyTo(null);
    }
  };
  useLogger(messages, "messages");
  return (
    <div className="flex w-full">
      <div className="z-10 mx-4 flex w-full flex-col ">
        <div className="relative w-full items-end ">
          <AnimatePresence>
            {replyTo && (
              <motion.div
                initial={{ opacity: 0, transform: "translateY(30%)" }}
                animate={{ opacity: 1, transform: "translateY(0)" }}
                exit={{ opacity: 0, transform: "translateY(30%)" }}
                className="relative left-0 right-0 z-[3] mb-2 rounded-md bg-slate-800 p-2 text-white"
              >
                <div className="flex items-center justify-between rounded-sm border-l-4 border-lime-400 bg-slate-600 px-2 py-1">
                  <div className="flex flex-col">
                    <span className="inline-flex text-green-400">
                      {replyTo.sender.username}
                    </span>
                    <span>{replyTo.text}</span>
                  </div>
                  <IconButton
                    onClick={() => {
                      setReplyTo(null);
                    }}
                  >
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </IconButton>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="flex flex-row items-center justify-center ">
          <Circle />
          {isCompleting ? (
            <Loader2 className="mr-2 animate-spin" />
          ) : (
            <div
              className="relative mr-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-slate-950 p-1 font-bold text-white"
              onClick={() => {
                autoComplete(
                  {
                    history: messages.slice(-10).map((message) => {
                      return {
                        text: message.text,
                        user: message.sender.username,
                      };
                    }),
                    output_user: user?.username ?? "",
                  },
                  {
                    onError: console.error,
                    onSuccess: (data) => {
                      setAiOptions(
                        data?.predictions[0]?.content
                          .split("\n")
                          .map((option) => option.trim().replace("*", "")) ?? []
                      );
                    },
                  }
                );
              }}
            >
              {/* <Sparkle className="absolute left-[-6px] top-[-6px] text-white" /> */}
              <img
                src="/bard.png"
                className="absolute right-[-6px] top-[-8px] h-6 w-6 text-white"
              />
              AI
              <div className="absolute left-0 -translate-y-[70%]">
                {aiOptions.length > 0 && (
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setAiOptions([]);
                    }}
                    className="absolute left-[-10px] top-[-10px] z-[40] flex cursor-pointer items-center justify-center rounded-full bg-[#000000] p-1"
                  >
                    <X className="h-4 w-4" />
                  </div>
                )}
                <AnimatePresence>
                  {aiOptions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, transform: "translateY(30%)" }}
                      animate={{ opacity: 1, transform: "translateY(0)" }}
                      exit={{ opacity: 0, transform: "translateY(30%)" }}
                      className="mb-2 rounded-md bg-slate-800 p-2 text-white"
                    >
                      <div className="flex flex-col gap-2">
                        {aiOptions.map((option, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              setInput((input) => input + option);
                              setAiOptions([]);
                            }}
                            className="w-[300px] rounded-sm bg-slate-600 px-2 py-1 text-start hover:bg-slate-500"
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
          <input
            type="text"
            id="chat-input"
            placeholder="Type your message"
            className="relative z-[4] h-10 w-5/6 flex-1 rounded-full border-2 border-gray-200 p-2  focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
