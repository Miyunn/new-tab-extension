import IconForm, { IconFormData } from "../../icon-form";

export default function ManualIconTab({
  onSubmit,
}: {
  onSubmit: (data: IconFormData) => Promise<void>;
}) {
  return <IconForm mode="add" onSubmit={onSubmit} />;
}
