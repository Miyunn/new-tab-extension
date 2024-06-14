import Icon from "./components/icon";
import "./styles.css";
import NoIconOptions from "../../components/no-icons-options";

interface Props {
  heightWidth: number;
  columns: number;
  gap: number;
  labels: boolean;
  iconData: any;
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

const IconGrid = ({ heightWidth, labels, gap, columns, iconData }: Props) => {
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
