"use client";

import Image from "next/image";
import { motion } from "framer-motion";

// MARK: - Types
interface Student {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
}

interface Teacher {
  id: string;
  username: string;
  avatarUrl?: string;
}

interface GroupClassAvatarsProps {
  students: Student[];
  teacher: Teacher;
  maxDisplay?: number;
}

export const GroupClassAvatars = ({ 
  students, 
  teacher, 
  maxDisplay = 5 
}: GroupClassAvatarsProps) => {
  const displayedStudents = students.slice(0, maxDisplay);
  const remainingCount = students.length - maxDisplay;

  return (
    <div className='flex items-center gap-4'>
      {/* Teacher Avatar */}
      <div className='flex items-center gap-2'>
        <div className='relative group'>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <Image
              src={teacher.avatarUrl || 'https://avatar.vercel.sh/teacher'}
              height={40}
              width={40}
              className='rounded-full border-2 border-primary object-cover'
              alt={teacher.username}
            />
          </motion.div>
          <div className='pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 transition-opacity group-hover:opacity-100 z-50'>
            <div className='flex items-center justify-center rounded-md bg-black/80 px-4 py-2'>
              <div className='text-center'>
                <p className='whitespace-nowrap text-sm font-semibold text-white'>
                  {teacher.username}
                </p>
                <p className='whitespace-nowrap text-xs text-white/70'>
                  教师
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className='h-8 w-px bg-gray-200 dark:bg-gray-700' />

      {/* Students Avatars */}
      <div className='flex -space-x-2'>
        {displayedStudents.map((student, idx) => (
          <div
            key={student.id}
            className='relative group'
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: idx * 0.1 }}
            >
              <Image
                src={student.avatarUrl || 'https://avatar.vercel.sh/student'}
                height={32}
                width={32}
                className='rounded-full border-2 border-white dark:border-gray-800 object-cover'
                alt={`${student.firstName} ${student.lastName}`}
              />
            </motion.div>
            <div className='pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 transition-opacity group-hover:opacity-100 z-50'>
              <div className='flex items-center justify-center rounded-md bg-black/80 px-4 py-2'>
                <div className='text-center'>
                  <p className='whitespace-nowrap text-sm font-semibold text-white'>
                    {student.firstName} {student.lastName}
                  </p>
                  <p className='whitespace-nowrap text-xs text-white/70'>
                    学生
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
        {remainingCount > 0 && (
          <div className='flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 border-2 border-white dark:border-gray-800 text-xs font-medium'>
            +{remainingCount}
          </div>
        )}
      </div>
    </div>
  );
}; 