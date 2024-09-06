import { Dropdown, MenuProps } from "antd";
import Icon from "./components/icon";
import "./styles.css";
import DeleteOutlined from "@ant-design/icons/lib/icons/DeleteOutlined";
import EditOutlined from "@ant-design/icons/lib/icons/EditOutlined";
import db from "../../database/indexDb";
import { DndContext } from "@dnd-kit/core";
import { IconData } from "../../types/iconData";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { useState } from "react";

interface Props {
  heightWidth: number;
  columns: number;
  gap: number;
  labels: boolean;
  iconData: IconData[];
  setIconData: React.Dispatch<React.SetStateAction<IconData[]>>;
  sortType: string;
}

const updateAllIconPositions = async (icons: IconData[]) => {
  //@ts-ignore
  await db.transaction("rw", db.icons, async () => {
    for (const icon of icons) {
      //@ts-ignore
      await db.icons.update(icon.id, { position: icon.position });
    }
  });
};

const deleteIcon = async (id: string) => {
  //@ts-ignore
  await db.icons.delete(id);
};

const editIcon = (iconData: IconData[]) => {
  console.log(iconData);
};

const IconComponent = ({
  heightWidth,
  labels,
  iconData,
  draggable,
}: {
  heightWidth: number;
  labels: boolean;
  iconData: IconData[];
  draggable: boolean;
}) =>
  iconData.map((icon: IconData) => {
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
        disabled: true,
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
            id={icon.id}
            key={icon.id}
            iconName={icon.name}
            url={icon.url}
            labels={labels}
            height={heightWidth}
            draggable={draggable}
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

const IconGrid = ({
  heightWidth,
  labels,
  gap,
  columns,
  iconData,
  setIconData,
  sortType,
}: Props) => {
  const [draggingIcons, setDraggingIcons] = useState(false);

  const startDrag = () => {
    setDraggingIcons(true);
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      try {
        const oldIndex = iconData.findIndex((icon) => icon.id === active.id);
        const newIndex = iconData.findIndex((icon) => icon.id === over.id);

        const newIconData = arrayMove(iconData, oldIndex, newIndex);
        newIconData.forEach((icon, index) => {
          icon.position = index;
        });

        await updateAllIconPositions(newIconData);
        setIconData(newIconData);
      } catch (error) {
        console.error("Failed to update icon positions:", error);
      }
    }
    setDraggingIcons(false);
  };

  return (
    <>
      {sortType === "position" ? (
        <DndContext onDragStart={startDrag} onDragEnd={handleDragEnd}>
          <div
            className="grid my-10"
            style={{
              gap: `${gap}px`,
              gridTemplateColumns: `repeat(${columns}, 1fr)`,
            }}
          >
            <SortableContext items={iconData}>
              <IconComponent
                heightWidth={heightWidth}
                labels={labels}
                iconData={iconData}
                draggable={draggingIcons}
              />
            </SortableContext>
          </div>
        </DndContext>
      ) : (
        <div
          className="grid my-10"
          style={{
            gap: `${gap}px`,
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
          }}
        >
          <SortableContext items={iconData}>
            <IconComponent
              heightWidth={heightWidth}
              labels={labels}
              iconData={iconData}
              draggable={draggingIcons}
            />
          </SortableContext>
        </div>
      )}
    </>
  );
};

export default IconGrid;
