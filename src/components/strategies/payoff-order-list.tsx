"use client";

import React from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import styles from "./PayoffOrderList.module.css";

interface Account {
  id: string;
  account_name: string;
  current_balance: number;
  interest_rate: number;
  minimum_payment: number;
}

interface SortableItemProps {
  id: string;
  account: Account;
  index: number;
  isCustom: boolean;
}

function SortableItem({ id, account, index, isCustom }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`${styles.item} ${isCustom ? styles.draggable : ""}`}
      {...(isCustom ? { ...attributes, ...listeners } : {})}
    >
      <div className={styles.rank}>#{index + 1}</div>
      <div className={styles.itemContent}>
        <div className={styles.itemName}>{account.account_name}</div>
        <div className={styles.itemMeta}>
          ${Number(account.current_balance).toLocaleString()} · {account.interest_rate}% APR
        </div>
      </div>
      {isCustom && <div className={styles.handle}>⠿</div>}
    </div>
  );
}

interface PayoffOrderListProps {
  accounts: Account[];
  onReorder: (newOrder: string[]) => void;
  isCustom: boolean;
  isRecalculating?: boolean;
}

export function PayoffOrderList({ 
  accounts, 
  onReorder, 
  isCustom,
  isRecalculating = false 
}: PayoffOrderListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = accounts.findIndex((a) => a.id === active.id);
      const newIndex = accounts.findIndex((a) => a.id === over.id);
      const newAccounts = arrayMove(accounts, oldIndex, newIndex);
      onReorder(newAccounts.map(a => a.id));
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>Payoff Order</h3>
        {isRecalculating && <span className={styles.recalculating}>Recalculating...</span>}
      </div>
      
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={accounts.map((a) => a.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className={styles.list}>
            {accounts.map((account, index) => (
              <SortableItem 
                key={account.id} 
                id={account.id} 
                account={account} 
                index={index}
                isCustom={isCustom}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
      
      {!isCustom && (
        <p className={styles.hint}>
          Order is automatically determined by your strategy. Switch to <strong>Custom Plan</strong> to manually reorder.
        </p>
      )}
    </div>
  );
}
