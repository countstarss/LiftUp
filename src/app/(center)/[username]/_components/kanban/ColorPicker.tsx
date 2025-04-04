import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const colors = [
  { name: 'red', class: 'bg-red-100' },
  { name: 'blue', class: 'bg-blue-100' },
  { name: 'green', class: 'bg-green-100' },
  { name: 'yellow', class: 'bg-yellow-100' },
  { name: 'purple', class: 'bg-purple-100' },
  { name: 'pink', class: 'bg-pink-100' },
  { name: 'indigo', class: 'bg-indigo-100' },
  { name: 'gray', class: 'bg-gray-100' },
];

interface ColorPickerProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
}

export function ColorPicker({ selectedColor, onColorSelect }: ColorPickerProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {colors.map((color) => (
        <Button
          key={color.name}
          variant="outline"
          size="sm"
          className={cn(
            "w-8 h-8 rounded-full p-0",
            color.class,
            selectedColor === color.class && "ring-2 ring-primary"
          )}
          onClick={() => onColorSelect(color.class)}
        />
      ))}
    </div>
  );
} 