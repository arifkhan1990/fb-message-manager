import React from 'react';
import { SelectionButton } from './SelectionButton';
import { ActionButton } from './ActionButton';
import { IoArchiveSharp, IoTrashSharp, IoCheckmarkDoneSharp } from 'react-icons/io5';

interface ActionBarProps {
  selectionMode: boolean;
  selectedCount: number;
  onToggleSelection: () => void;
  onSelectAll: () => void;
  onArchiveSelected: () => void;
  onDeleteSelected: () => void;
  getTranslation: (key: string) => string;
}

export const ActionBar: React.FC<ActionBarProps> = ({
  selectionMode,
  selectedCount,
  onToggleSelection,
  onSelectAll,
  onArchiveSelected,
  onDeleteSelected,
  getTranslation
}) => {
  return (
    <div className="sidebar-actions">
      <SelectionButton
        isSelectionMode={selectionMode}
        onClick={onToggleSelection}
        getTranslation={getTranslation}
      />
      
      <ActionButton
        variant="secondary"
        onClick={onSelectAll}
        icon={<IoCheckmarkDoneSharp size={20} />}
        label={getTranslation('Select All')}
      />
      
      <div className="action-group">
        <ActionButton
          variant="warning"
          onClick={onArchiveSelected}
          disabled={selectedCount === 0}
          icon={<IoArchiveSharp size={20} />}
          label={getTranslation('Archive Selected')}
          count={selectedCount}
        />
        
        <ActionButton
          variant="danger"
          onClick={onDeleteSelected}
          disabled={selectedCount === 0}
          icon={<IoTrashSharp size={20} />}
          label={getTranslation('Delete Selected')}
          count={selectedCount}
        />
      </div>
    </div>
  );
}; 