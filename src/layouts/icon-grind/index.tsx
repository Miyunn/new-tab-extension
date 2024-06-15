import { Dropdown, MenuProps } from "antd";
import Icon from "./components/icon";
import "./styles.css";
import DeleteOutlined from "@ant-design/icons/lib/icons/DeleteOutlined";
import EditOutlined from "@ant-design/icons/lib/icons/EditOutlined";

interface Props {
  heightWidth: number;
  columns: number;
  gap: number;
  labels: boolean;
  iconData: any;
}

const items: MenuProps["items"] = [
  {
    label: "Edit",
    key: "1",
    icon: <EditOutlined />,
  },
  {
    label: "Delete",
    key: "2",
    danger: true,
    icon: <DeleteOutlined />,
  },
];

const icons = (heightWidth: number, labels: boolean, iconData: any[]) =>
  iconData.map((icon) => (
    <Dropdown
      menu={{ items }}
      trigger={["contextMenu"]}
      key={icon.id}
      placement="bottomLeft"
    >
      <div>
        <Icon
          key={icon.name}
          iconName={icon.name}
          url={icon.url}
          labels={labels}
        >
          <img
            width={heightWidth}
            height={heightWidth}
            src={icon.src}
            alt={icon.name}
          />
        </Icon>
      </div>
    </Dropdown>
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
