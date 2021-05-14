import React from 'react';
import styled from 'styled-components';

const S = {
  Wrapper: styled.div`
    display: grid;
    grid-template-columns: max-content max-content;
    grid-gap: 5px;
    padding: 5px;
  `,
  Label: styled.label`
    text-align: center;
    vertical-align: middle;
  `,
  Input: styled.input`
    margin: 0;
    float: right;
  `,
};

type Props = {
  label: string;
  name: string;
  min: number;
  max: number;
  value: number;
  onChange: (v: number) => void;
};

export const NumberInput = ({
  label,
  name,
  min,
  max,
  value,
  onChange,
}: Props) => {
  return (
    <S.Wrapper>
      <S.Label htmlFor={name}>{label}</S.Label>
      <S.Input
        type="number"
        id={name}
        name={name}
        min={min}
        max={max}
        style={{ display: 'inline-block' }}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
      />
    </S.Wrapper>
  );
};
