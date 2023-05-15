import React from "react";
import { toast } from "react-hot-toast";
import { api } from "@/utils/api";

interface CreateTeamFormProps {
  setOpenAddChatroomModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CreateTeamForm({
  setOpenAddChatroomModal,
}: CreateTeamFormProps) {
  const [chatroomName, setChatroomName] = React.useState("");
  const { mutate: createChatroom, isLoading: isLoadingChatroomCreate } =
    api.chat.createChatroom.useMutation();
  return (
    <form
      className="flex min-w-[400px] flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        createChatroom(
          { chatroom_name: chatroomName, type: "team" },
          {
            onSuccess: (data) => {
              console.log(data);

              setOpenAddChatroomModal(false);
              toast.success("Chatroom created successfully");
            },
            onError: (error) => {
              toast.error(error.message);
            },
          }
        );
      }}
    >
      <h3>Create new team</h3>
      <input
        type="text"
        // value={formData.name}
        required
        onChange={(e) => {
          setChatroomName(e.target.value);
        }}
        placeholder="Name"
        className="input w-full rounded-md  border border-gray-300 bg-white shadow-sm outline-none focus:border-primary focus:outline-none"
      />
      {/* <select
              value={formData.status}
              required
              onChange={(e) => {
                setFormData({ ...formData, status: e.target.value });
              }}
              className="select w-full max-w-xs rounded-md  border border-gray-300 bg-white shadow-sm outline-none focus:border-primary focus:outline-none"
            >
              <option disabled>Status</option>
              <option value={PROGRESS.Todo}>{PROGRESS.Todo}</option>
              <option value={PROGRESS.In_Progress}>
                {PROGRESS.In_Progress}
              </option>
              <option value={PROGRESS.Done}>{PROGRESS.Done}</option>
            </select> */}
      {/* <textarea
            className="textarea w-full max-w-xs rounded-md  border border-gray-300 bg-white shadow-sm outline-none focus:border-primary focus:outline-none"
            name="description"
            id="description"
            cols={30}
            placeholder="Description"
            value={formData.description}
            onChange={(e) => {
              setFormData({ ...formData, description: e.target.value });
            }}
          ></textarea> */}

      <button
        className={`btn-success h-10 w-full rounded-md  border border-gray-300 bg-white shadow-sm outline-none focus:border-primary focus:outline-none`}
        // className={`btn-success btn ${isCreatingTask ? "loading" : ""}`}
      >
        Create
      </button>
    </form>
  );
}
