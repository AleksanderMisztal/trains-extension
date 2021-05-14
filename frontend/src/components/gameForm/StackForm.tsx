import React from 'react';
import { NumberInput } from '../common/form/Form';

export const StackForm = ({ s, dispatch }) => {
  return (
    <div>
      {Object.keys(s.inittake).map((name) => (
        <NumberInput
          key={'init' + name}
          name={'init' + name}
          label={`Initial ${name}`}
          min={1}
          max={10}
          value={s.inittake[name]}
          onChange={(v) => dispatch({ type: 'inittake', name, take: v })}
        />
      ))}
      <NumberInput
        name="initkeep"
        label="Initial keep"
        min={1}
        max={10}
        value={s.initkeep}
        onChange={(v) => dispatch({ type: 'initkeep', keep: v })}
      />
      <NumberInput
        name="stdtake"
        label="Take"
        min={1}
        max={10}
        value={s.stdtake}
        onChange={(v) => dispatch({ type: 'stdtake', take: v })}
      />
      <NumberInput
        name="stdkeep"
        label="Keep"
        min={1}
        max={10}
        value={s.stdkeep}
        onChange={(v) => dispatch({ type: 'stdkeep', keep: v })}
      />
    </div>
  );
};
