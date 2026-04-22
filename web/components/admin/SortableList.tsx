'use client';

import React from 'react';
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor,
  useSensor, useSensors, type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext, sortableKeyboardCoordinates,
  verticalListSortingStrategy, useSortable, arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type HandleProps = React.HTMLAttributes<HTMLElement> & { style?: React.CSSProperties };

export type RenderItemArgs = {
  handleProps: HandleProps;
  isDragging: boolean;
};

type Props<T extends { id: string }> = {
  items: T[];
  onReorder: (orderedIds: string[]) => void;
  renderItem: (item: T, args: RenderItemArgs) => React.ReactNode;
  disabled?: boolean;
};

function SortableRow<T extends { id: string }>({
  item, renderItem, disabled,
}: {
  item: T;
  renderItem: Props<T>['renderItem'];
  disabled?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id, disabled });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 'auto',
    position: 'relative',
  };

  const handleProps: HandleProps = {
    ...attributes,
    ...listeners,
    style: { cursor: disabled ? 'default' : 'grab', touchAction: 'none' },
  };

  return (
    <div ref={setNodeRef} style={style}>
      {renderItem(item, { handleProps, isDragging })}
    </div>
  );
}

export function SortableList<T extends { id: string }>({
  items, onReorder, renderItem, disabled,
}: Props<T>) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIdx = items.findIndex((i) => i.id === active.id);
    const newIdx = items.findIndex((i) => i.id === over.id);
    if (oldIdx < 0 || newIdx < 0) return;
    onReorder(arrayMove(items, oldIdx, newIdx).map((i) => i.id));
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
        {items.map((item) => (
          <SortableRow key={item.id} item={item} renderItem={renderItem} disabled={disabled} />
        ))}
      </SortableContext>
    </DndContext>
  );
}

/** Poignée de drag pré-stylée — à utiliser dans `renderItem` via `handleProps`. */
export function DragHandle({ handleProps, disabled }: { handleProps: HandleProps; disabled?: boolean }) {
  return (
    <span
      {...handleProps}
      style={{
        ...handleProps.style,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 22, height: 22,
        color: 'var(--c-sub)',
        fontSize: 14,
        userSelect: 'none',
        opacity: disabled ? 0.3 : 0.7,
      }}
      title={disabled ? '' : 'Glisser pour réordonner'}
      aria-label="Poignée de glisser-déposer"
    >
      ⋮⋮
    </span>
  );
}
