//TODO:Save images as blobs instead of base64

import db from "./../../../database/indexDb";
import { IconData } from "../../../types/iconData";
import IconForm, { IconFormData } from "../../icon-form";

interface Props {
  selectedIcon: IconData;
  setEditIconModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isBlockingSave: boolean;
  setIsBlockingSave: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function EditIconForm({
  selectedIcon,
  setEditIconModalOpen,
  setIsBlockingSave,
}: Props) {
  const handleSubmit = async (data: IconFormData) => {
    await db.icons.update(selectedIcon.id, {
      name: data.name,
      src: data.src,
      url: data.destination,
    });

    setEditIconModalOpen(false);
  };

  return (
    <IconForm
      mode="edit"
      formId="edit-icon-form"
      initialData={{
        name: selectedIcon.name,
        destination: selectedIcon.url,
        src: selectedIcon.src,
      }}
      onSubmit={handleSubmit}
      onPendingChange={setIsBlockingSave}
    />
  );
}
