export const revalidate = 60; // 每 60 秒重新验证数据

export default function Home() {
  return (
    // NOTE: 负责首页样式和布局，同级别路由可完全替换 ，如 /studio/
    <>
      <h1 className="text-center text-3xl font-bold">LiftUp!</h1>
    </>
  );
}
