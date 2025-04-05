"use client";

import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { mockThemes } from '@/data/mockData';
import { ColorPicker } from "./ColorPicker";

// 创建一个简化版的课程卡片组件
function CompactCourseCard({ course }: { course: Course }) {
  return (
    <div className="bg-card rounded-md shadow-sm p-3 hover:shadow-md transition-shadow">
      <div className="flex gap-3">
        {/* 缩略图 */}
        <div className="relative w-20 h-20 flex-shrink-0">
          <img
            src={course.imageUrl}
            alt={course.title}
            className="w-full h-full object-cover rounded-md"
          />
        </div>
        {/* 内容 */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm line-clamp-2">{course.title}</h3>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {course.smallSummary}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-muted-foreground">
              {new Date(course.uploadedAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface Theme {
  id: string;
  title: string;
  color: string;
  courses: Course[];
}

interface Course {
  id: string;
  title: string;
  smallSummary: string;
  price: number;
  uploadedAt: Date;
  videoUrl?: string;
  imageUrl: string;
}

export default function KanbanBoard() {
  const [themes, setThemes] = useState(mockThemes);
  const [newThemeTitle, setNewThemeTitle] = useState('');
  const [selectedColor, setSelectedColor] = useState('bg-red-100');

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceThemeId = source.droppableId;
    const destThemeId = destination.droppableId;

    const newThemes = [...themes];
    const sourceTheme = newThemes.find(t => t.id === sourceThemeId);
    const destTheme = newThemes.find(t => t.id === destThemeId);

    if (!sourceTheme || !destTheme) return;

    const [movedCourse] = sourceTheme.courses.splice(source.index, 1);
    destTheme.courses.splice(destination.index, 0, movedCourse);

    setThemes(newThemes);
  };

  const handleAddTheme = () => {
    if (!newThemeTitle.trim()) {
      toast.error('Please enter a theme title');
      return;
    }

    const newTheme: Theme = {
      id: Date.now().toString(),
      title: newThemeTitle,
      color: selectedColor,
      courses: [],
    };

    setThemes([...themes, newTheme]);
    setNewThemeTitle('');
  };

  const handleSave = () => {
    toast.success('Changes saved successfully');
  };

  return (
    <div className="flex flex-col sticky top-auto">
      <div className=" flex justify-between items-center p-4 bg-transparent">
        <h1 className="text-2xl font-bold">Kanban Board</h1>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Theme
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Theme</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  value={newThemeTitle}
                  onChange={(e) => setNewThemeTitle(e.target.value)}
                  placeholder="Enter theme title"
                />
                <div>
                  <label className="text-sm font-medium">Theme Color</label>
                  <ColorPicker
                    selectedColor={selectedColor}
                    onColorSelect={setSelectedColor}
                  />
                </div>
                <Button onClick={handleAddTheme}>Add Theme</Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button size="sm" onClick={handleSave}>Save Changes</Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {themes.map((theme) => (
              <Droppable key={theme.id} droppableId={theme.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={cn(
                      "px-3 rounded-lg overflow-y-auto",
                      // theme.color
                    )}
                  >
                    <h2 className="text-base font-semibold mb-3 sticky top-0 bg-inherit py-1 z-50 pt-3">
                      {theme.title}
                    </h2>
                    <div className="space-y-2">
                      {theme.courses.map((course, index) => (
                        <Draggable
                          key={course.id}
                          draggableId={course.id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <CompactCourseCard course={course}/>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
} 