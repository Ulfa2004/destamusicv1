"use client";

import * as RadixSlider from '@radix-ui/react-slider';

interface SlideProps {
  value?: number;
  onChange?: (value: number) => void;
  max?: number; // <--- PERBAIKAN 1: Menambahkan prop max ke interface
}

const Slider: React.FC<SlideProps> = ({ 
  value = 1, 
  onChange,
  max = 1 // <--- PERBAIKAN 2: Menerima prop max (default 1 untuk volume)
}) => {
  const handleChange = (newValue: number[]) => {
    onChange?.(newValue[0]);
  };

  return ( 
    <RadixSlider.Root
      className="
        relative 
        flex 
        items-center 
        select-none 
        touch-none 
        w-full 
        h-10
      "
      defaultValue={[1]}
      value={[value]}
      onValueChange={handleChange}
      max={max} // <--- PERBAIKAN 3: Menggunakan prop max yang dinamis
      step={0.1}
      aria-label="Volume"
    >
      <RadixSlider.Track 
        className="
          bg-neutral-600 
          relative 
          grow 
          rounded-full 
          h-[3px]
        "
      >
        <RadixSlider.Range 
          className="
            absolute 
            bg-white 
            rounded-full 
            h-full
          " 
        />
      </RadixSlider.Track>
    </RadixSlider.Root>
  );
}
 
export default Slider;
