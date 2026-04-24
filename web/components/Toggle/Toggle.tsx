'use client';

import { Track, Thumb } from './Toggle.styles';

interface ToggleProps {
  checked: boolean;
  onChange: (val: boolean) => void;
}

export function Toggle({ checked, onChange }: ToggleProps) {
  return (
    <Track $checked={checked} onClick={() => onChange(!checked)}>
      <Thumb $checked={checked} />
    </Track>
  );
}
