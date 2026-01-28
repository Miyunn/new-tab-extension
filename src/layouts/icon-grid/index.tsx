import { Button, Dropdown, MenuProps, Modal } from "antd";
import Icon from "./components/icon";
import "./styles.css";
import DeleteOutlined from "@ant-design/icons/lib/icons/DeleteOutlined";
import EditOutlined from "@ant-design/icons/lib/icons/EditOutlined";
import db from "../../database/indexDb";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensors,
  useSensor,
} from "@dnd-kit/core";
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
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
}

const updateAllIconPositions = async (icons: IconData[]) => {
  await db.transaction("rw", db.icons, async () => {
    for (const icon of icons) {
      await db.icons.update(icon.id, { position: icon.position });
    }
  });
};

const deleteIcon = async (id: string) => {
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
        overlayClassName="glass-context-menu"
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
  setIsDragging,
}: Props) => {
  const [selectedIcon, setSelectedIcon] = useState<IconData | null>(null);
  const [editIconModalOpen, setEditIconModalOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // User must move 5px before it counts as a drag
      },
    }),
  );

  const startDrag = () => {
    setIsDragging(true);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
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

      setIconData(newIconData); // immediate UI update

      updateAllIconPositions(newIconData).catch(console.error);
    } else {
      setIsDragging(true);
    }
  };

  const handleEditIcon = (icon: IconData): void => {
    setSelectedIcon(icon);
    setEditIconModalOpen(true);
  };

  return (
    <>
      {sortType === "position" ? (
        <DndContext
          onDragStart={startDrag}
          onDragEnd={handleDragEnd}
          sensors={sensors}
        >
          <div
            className="grid my-10"
            style={{
              gap: `${gap}px`,
              gridTemplateColumns: `repeat(${columns}, 1fr)`,
            }}
          >
            <SortableContext items={iconData.map((i) => i.id)}>
              {iconData.map((icon) => (
                <IconComponent
                  key={icon.id}
                  heightWidth={heightWidth}
                  labels={labels}
                  iconData={[icon]}
                  draggable={sortType === "position"}
                  iconBackground={iconBackground}
                  iconBackgroundColor={iconBackgroundColor}
                  iconBackgroundOpacity={iconBackgroundOpacity}
                  iconBackgroundRadius={iconBackgroundRadius}
                  onEditIcon={handleEditIcon}
                />
              ))}

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
          <SortableContext items={iconData.map((i) => i.id)}>
            {iconData.map((icon) => (
              <IconComponent
                key={icon.id}
                heightWidth={heightWidth}
                labels={labels}
                iconData={[icon]}
                draggable={sortType === "position"}
                iconBackground={iconBackground}
                iconBackgroundColor={iconBackgroundColor}
                iconBackgroundOpacity={iconBackgroundOpacity}
                iconBackgroundRadius={iconBackgroundRadius}
                onEditIcon={handleEditIcon}
              />
            ))}

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
          </SortableContext>{" "}
        </div>
      )}

      <Modal
        title={`Edit ${selectedIcon?.name} Icon`}
        open={editIconModalOpen}
        centered
        onCancel={() => {
          setEditIconModalOpen(false);
          setSelectedIcon(null);
        }}
        footer={(_, { CancelBtn }) => (
          <>
            <CancelBtn />
            <Button type="primary" htmlType="submit" form="edit-icon-form">
              Save
            </Button>
          </>
        )}
        styles={{
          content: {
            backgroundColor: "rgba(0, 0, 0, 0.80)",
            backdropFilter: "blur(8px)",
            boxShadow: "none",
          },
          header: {
            backgroundColor: "transparent",
            borderBottom: "none",
          },
          body: {
            backgroundColor: "transparent",
          },
          footer: {
            backgroundColor: "transparent",
            borderTop: "none",
          },
          mask: {
            backdropFilter: "blur(4px)",
          },
        }}
      >
        {selectedIcon && (
          <EditIconForm
            key={selectedIcon.id}
            selectedIcon={selectedIcon}
            setEditIconModalOpen={setEditIconModalOpen}
          />
        )}
      </Modal>
    </>
  );
};

export default IconGrid;
