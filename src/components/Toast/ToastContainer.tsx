import React from 'react';
import { Toast, ToastPosition } from '../../types';
import { ToastItem } from './ToastItem';

export interface ToastContainerProps {
  toasts: Toast[];
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts }) => {
  // Group toasts by position
  const groupedToasts = toasts.reduce<Record<ToastPosition, Toast[]>>((acc, t) => {
    const pos = t.position;
    if (!acc[pos]) {
      acc[pos] = [];
    }
    acc[pos].push(t);
    return acc;
  }, {} as Record<ToastPosition, Toast[]>);

  const positions = Object.keys(groupedToasts) as ToastPosition[];

  return (
    <>
      {positions.map((pos) => {
        const list = groupedToasts[pos];
        if (!list || list.length === 0) return null;

        // For bottom-placed toasts, we reverse the array order so that
        // the newest toasts stack on top of older ones (closer to the screen edge).
        const isBottom = pos.startsWith('bottom');
        const sortedList = isBottom ? [...list].reverse() : list;

        return (
          <div
            key={pos}
            className={`rnk-toast-container-wrapper rnk-toast-${pos} rnk-container-root`}
            data-testid={`toast-container-${pos}`}
          >
            {sortedList.map((t) => (
              <ToastItem key={t.id} toast={t} />
            ))}
          </div>
        );
      })}
    </>
  );
};
