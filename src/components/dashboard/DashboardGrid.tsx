'use client';

import { useState } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from '@hello-pangea/dnd';
import { GripVertical, ChevronDown, ChevronUp, X } from 'lucide-react';

export interface WidgetConfig {
  id: string;
  type: string;
  title: string;
  span?: 1 | 2 | 3;
  isVisible: boolean;
}

interface DashboardGridProps {
  widgets: WidgetConfig[];
  onReorder: (newOrder: WidgetConfig[]) => void;
  editMode: boolean;
  renderWidget: (widget: WidgetConfig) => React.ReactNode;
}

export default function DashboardGrid({
  widgets,
  onReorder,
  editMode,
  renderWidget,
}: DashboardGridProps) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const visibleWidgets = widgets.filter((w) => w.isVisible);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(widgets);
    const visibleIds = visibleWidgets.map((w) => w.id);
    const srcId = visibleIds[result.source.index];
    const destId = visibleIds[result.destination.index];
    const srcIdx = items.findIndex((w) => w.id === srcId);
    const destIdx = items.findIndex((w) => w.id === destId);
    const [moved] = items.splice(srcIdx, 1);
    items.splice(destIdx, 0, moved);
    onReorder(items);
  };

  const toggleCollapse = (id: string) => {
    setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const removeWidget = (id: string) => {
    onReorder(
      widgets.map((w) => (w.id === id ? { ...w, isVisible: false } : w))
    );
  };

  const spanClass = (span?: 1 | 2 | 3) => {
    if (span === 2) return 'md:col-span-2';
    if (span === 3) return 'md:col-span-2 lg:col-span-3';
    return '';
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="dashboard-grid" direction="vertical">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {visibleWidgets.map((widget, index) => (
              <Draggable
                key={widget.id}
                draggableId={widget.id}
                index={index}
                isDragDisabled={!editMode}
              >
                {(draggableProvided, snapshot) => (
                  <div
                    ref={draggableProvided.innerRef}
                    {...draggableProvided.draggableProps}
                    className={`bg-surface rounded-card shadow-card overflow-hidden ${spanClass(widget.span)} ${
                      snapshot.isDragging ? 'ring-2 ring-primary-500 shadow-lg z-50' : ''
                    } ${editMode ? 'ring-1 ring-dashed ring-primary-200' : ''}`}
                  >
                    {/* Title bar */}
                    <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
                      {editMode && (
                        <div
                          {...draggableProvided.dragHandleProps}
                          className="cursor-grab active:cursor-grabbing text-muted hover:text-foreground"
                        >
                          <GripVertical size={18} />
                        </div>
                      )}
                      <h3 className="flex-1 text-sm font-semibold text-foreground">
                        {widget.title}
                      </h3>
                      <button
                        onClick={() => toggleCollapse(widget.id)}
                        className="text-muted hover:text-foreground p-1 rounded transition-colors"
                        aria-label={collapsed[widget.id] ? 'Déplier' : 'Replier'}
                      >
                        {collapsed[widget.id] ? (
                          <ChevronDown size={16} />
                        ) : (
                          <ChevronUp size={16} />
                        )}
                      </button>
                      {editMode && (
                        <button
                          onClick={() => removeWidget(widget.id)}
                          className="text-muted hover:text-danger p-1 rounded transition-colors"
                          aria-label="Retirer le widget"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                    {/* Content */}
                    {!collapsed[widget.id] && (
                      <div className="p-4">{renderWidget(widget)}</div>
                    )}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
