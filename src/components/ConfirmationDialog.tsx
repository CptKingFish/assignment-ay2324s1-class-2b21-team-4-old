import CustomModal from "./Modal";

interface ConfirmationDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void;
}

export default function ConfirmationDialog({
  isOpen,
  setIsOpen,
  title,
  description,
  onConfirm,
}: ConfirmationDialogProps) {
  return (
    <CustomModal modalOpen={isOpen} setModalOpen={setIsOpen}>
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-sm">{description}</p>
        <div className="mt-5 flex justify-center">
          <button
            className="btn-primary btn-sm btn mr-2"
            data-theme="corporate"
            onClick={onConfirm}
          >
            Confirm
          </button>
          <button
            className="btn-secondary btn-sm btn"
            data-theme="corporate"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </CustomModal>
  );
}
