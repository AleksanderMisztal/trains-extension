import React from 'react';

export const Checkbox = ({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: React.ChangeEventHandler;
}) => {
  return (
    <div className="form-check">
      <input
        className="form-check-input position-static"
        aria-label="..."
        type="checkbox"
        checked={checked}
        onChange={onChange}
      />
    </div>
  );
};
