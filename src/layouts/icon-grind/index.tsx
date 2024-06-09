import Icon from "./components/icon";
import db from "../../database/indexDb";
import "./styles.css";
import { useLiveQuery } from "dexie-react-hooks";

interface Props {
  heightWidth: number;
  columns: number;
  gap: number;
  labels: boolean;
}

const icons = (heightWidth: number, labels: boolean, iconData: any[]) =>
  iconData.map((icon) => (
    <Icon key={icon.name} iconName={icon.name} url={icon.url} labels={labels}>
      <img
        width={heightWidth}
        height={heightWidth}
        src={icon.src}
        alt={icon.name}
      />
    </Icon>
  ));

const IconGrid = ({ heightWidth, labels, gap, columns }: Props) => {
  const iconTable = db.table("icons");
  const iconData = useLiveQuery(() => iconTable.toArray(), []);

  return (
    <div
      className="grid mt-10"
      style={{
        gap: `${gap}px`,
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
      }}
    >
      {icons(heightWidth, labels, iconData || [])}
    </div>
  );
};

export default IconGrid;
