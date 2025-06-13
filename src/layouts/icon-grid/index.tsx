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
import EditIconForm from "./components/editIconModal";
import AddNewIcon from "./components/add-icon-icon";

interface Props {
  heightWidth: number;
  columns: number;
  gap: number;
  labels: boolean;
  iconData: IconData[];
  setIconData: React.Dispatch<React.SetStateAction<IconData[]>>;
  sortType: string;
  iconBackground: boolean;
  iconBackgroundColor: string;
  iconBackgroundOpacity: number;
  iconBackgroundRadius: number;
  showAddIconDrawer: () => void;
  hideAddIconShortcut: boolean;
}

const updateAllIconPositions = async (icons: IconData[]) => {
  // @ts-ignore
  await db.transaction("rw", db.icons, async () => {
    for (const icon of icons) {
      // @ts-ignore
      await db.icons.update(icon.id, { position: icon.position });
    }
  });
};

const deleteIcon = async (id: string) => {
  // @ts-ignore
  await db.icons.delete(id);
};

const IconComponent = ({
  heightWidth,
  labels,
  iconData,
  draggable,
  iconBackground,
  iconBackgroundColor,
  iconBackgroundOpacity,
  iconBackgroundRadius,
  onEditIcon,
}: {
  heightWidth: number;
  labels: boolean;
  iconData: IconData[];
  draggable: boolean;
  iconBackground: boolean;
  iconBackgroundColor: string;
  iconBackgroundOpacity: number;
  iconBackgroundRadius: number;
  onEditIcon: (icon: IconData) => void;
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
        icon: <EditOutlined />,
        onClick: () => onEditIcon(icon),
      },
      {
        label: "Delete",
        key: "delete",
        danger: true,
        icon: <DeleteOutlined />,
        onClick: () => deleteIcon(icon.id),
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
            iconBackground={iconBackground}
            iconBackgroundColor={iconBackgroundColor}
            iconBackgroundOpacity={iconBackgroundOpacity}
            iconBackgroundRadius={iconBackgroundRadius}
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
  iconBackground,
  iconBackgroundColor,
  iconBackgroundOpacity,
  iconBackgroundRadius,
  showAddIconDrawer,
  hideAddIconShortcut,
}: Props) => {
  const [draggingIcons, setDraggingIcons] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<IconData | null>(null);

  const startDrag = () => {
    setDraggingIcons(true);
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = iconData.findIndex((icon) => icon.id === active.id);
      const newIndex = iconData.findIndex((icon) => icon.id === over.id);

      const newIconData = arrayMove(iconData, oldIndex, newIndex).map(
        (icon, index) => ({
          ...icon,
          position: index,
        }),
      );

      setIconData(newIconData);

      try {
        await updateAllIconPositions(newIconData);
      } catch (error) {
        console.error("Failed to update icon positions:", error);
        setIconData(iconData);
      }
    }
    setDraggingIcons(false);
  };

  const handleEditIcon = (icon: IconData): void => {
    setSelectedIcon(icon);
    (
      document.getElementById("edit-icon-modal") as HTMLDialogElement
    )?.showModal();
  };

  const closeModal = (): void => {
    (document.getElementById("edit-icon-modal") as HTMLDialogElement)?.close();
    setSelectedIcon(null);
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
                iconBackground={iconBackground}
                iconBackgroundColor={iconBackgroundColor}
                iconBackgroundOpacity={iconBackgroundOpacity}
                iconBackgroundRadius={iconBackgroundRadius}
                onEditIcon={handleEditIcon}
              />
              {!hideAddIconShortcut && (
                <AddNewIcon
                  heightWidth={heightWidth}
                  showAddIconDrawer={showAddIconDrawer}
                  iconBackground={iconBackground}
                  iconBackgroundColor={iconBackgroundColor}
                  iconBackgroundOpacity={iconBackgroundOpacity}
                  iconBackgroundRadius={iconBackgroundRadius}
                  labels={labels}
                />
              )}
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
              iconBackground={iconBackground}
              iconBackgroundColor={iconBackgroundColor}
              iconBackgroundOpacity={iconBackgroundOpacity}
              iconBackgroundRadius={iconBackgroundRadius}
              onEditIcon={handleEditIcon}
            />
            {!hideAddIconShortcut && (
              <AddNewIcon
                heightWidth={heightWidth}
                showAddIconDrawer={showAddIconDrawer}
                iconBackground={iconBackground}
                iconBackgroundColor={iconBackgroundColor}
                iconBackgroundOpacity={iconBackgroundOpacity}
                iconBackgroundRadius={iconBackgroundRadius}
                labels={labels}
              />
            )}
          </SortableContext>
        </div>
      )}

      <dialog id="edit-icon-modal" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={closeModal}
            >
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Edit {selectedIcon?.name} Icon</h3>
          {selectedIcon && (
            <div>
              <EditIconForm
                selectedIcon={selectedIcon}
                closeModal={closeModal}
              />
            </div>
          )}
        </div>
      </dialog>
    </>
  );
};

export default IconGrid;
