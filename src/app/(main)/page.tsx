import ActionSuggestion from '@/components/ActionSuggestion';
import React from 'react';

const Page = () => {
  return (
    <>
      <div className="md:mx-20 mt-10 rounded-sm bg-white dark:bg-gray-800 p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 dark:text-white">行动起来，摆脱消沉</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Cursor帮助你选择并执行积极行动，提升生活质量
          </p>
        </div>
        <ActionSuggestion />
      </div>
    </>
  );
};

export default Page;