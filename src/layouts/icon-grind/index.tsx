import { Dropdown, MenuProps } from "antd";
import Icon from "./components/icon";
import "./styles.css";
import DeleteOutlined from "@ant-design/icons/lib/icons/DeleteOutlined";
import EditOutlined from "@ant-design/icons/lib/icons/EditOutlined";
import db from "../../database/indexDb";

interface Props {
  heightWidth: number;
  columns: number;
  gap: number;
  labels: boolean;
  iconData: any;
}

const deleteIcon = async (id: string) => {
  //@ts-ignore
  await db.icons.delete(id);
};

const editIcon = (iconData: any) => {
  console.log(iconData);
};

const icons = (heightWidth: number, labels: boolean, iconData: any[]) =>
  iconData.map((icon) => {
    const menuItems: MenuProps["items"] = [
      {
        label: icon.name,
        key: "logo",
        style: { fontWeight: "bold", pointerEvents: "none" },
        icon: <img width={16} height={16} src={icon.src} />,
      },
      {
        label: "Edit",
        key: "edit",
        icon: <EditOutlined />,
        onClick: () => {
          editIcon(iconData);
        },
      },
      {
        label: "Delete",
        key: "delete",
        danger: true,
        icon: <DeleteOutlined />,
        onClick: () => {
          deleteIcon(icon.id);
        },
      },
    ];

    return (
      <Dropdown
        menu={{ items: menuItems }}
        trigger={["contextMenu"]}
        key={icon.id}
        placement="bottomLeft"
      >
        <div>
          <Icon
            key={icon.id}
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
    );
  });

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
