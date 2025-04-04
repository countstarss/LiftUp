// MARK: Action类型定义
export interface Action {
  id: string;
  name: string;
  description: string;
  type: string;          // 行动类型：运动、放松、学习等
  location: string;      // 适合的地点：室内、室外、任何地方
  equipment: string;     // 所需设备：无、基础、专业
  energy: string;        // 所需能量：低、中、高
  duration: number;      // 预计时长（分钟）
  createdAt: Date;
  updatedAt: Date;
  postCount?: number;    // 相关帖子数量
}

// 定义常量用于过滤选项
export const ACTION_TYPES = ['运动', '放松', '社交', '学习', '创作', '其他'] as const;
export const LOCATIONS = ['室内', '室外', '任何地方'] as const;
export const EQUIPMENT_LEVELS = ['无', '基础', '专业'] as const;
export const ENERGY_LEVELS = ['低', '中', '高'] as const;

// MARK: 模拟数据
export const actions: Action[] = [
  {
    id: '1',
    name: '散步',
    description: '在户外慢走30分钟，放松身心，享受自然。',
    type: '运动',
    location: '室外',
    equipment: '无',
    energy: '低',
    duration: 30,
    createdAt: new Date('2025-04-01T08:00:00Z'),
    updatedAt: new Date('2025-04-01T08:00:00Z'),
    postCount: 5
  },
  {
    id: '2',
    name: '瑜伽',
    description: '进行基础瑜伽练习，提高身体灵活性和平衡感。',
    type: '运动',
    location: '室内',
    equipment: '基础',
    energy: '中',
    duration: 45,
    createdAt: new Date('2025-04-01T09:00:00Z'),
    updatedAt: new Date('2025-04-01T09:00:00Z'),
    postCount: 3
  },
  {
    id: '3',
    name: '绘画',
    description: '尝试简单的素描或涂色，释放创造力和压力。',
    type: '创作',
    location: '室内',
    equipment: '基础',
    energy: '低',
    duration: 60,
    createdAt: new Date('2025-04-02T10:00:00Z'),
    updatedAt: new Date('2025-04-02T10:00:00Z'),
    postCount: 2
  },
  {
    id: '4',
    name: '阅读',
    description: '找一本喜欢的书，安静地阅读一会儿。',
    type: '放松',
    location: '任何地方',
    equipment: '无',
    energy: '低',
    duration: 40,
    createdAt: new Date('2025-04-02T11:00:00Z'),
    updatedAt: new Date('2025-04-02T11:00:00Z'),
    postCount: 1
  },
  {
    id: '5',
    name: '跑步',
    description: '进行中等强度的慢跑，提高心肺功能。',
    type: '运动',
    location: '室外',
    equipment: '基础',
    energy: '高',
    duration: 30,
    createdAt: new Date('2025-04-03T12:00:00Z'),
    updatedAt: new Date('2025-04-03T12:00:00Z'),
    postCount: 4
  },
  {
    id: '6',
    name: '冥想10分钟',
    description: '冥想10分钟，放松身心，提高专注力。',
    type: '放松',
    location: '任何地方',
    equipment: '无',
    energy: '低',
    duration: 10,
    createdAt: new Date('2025-04-04T13:00:00Z'),
    updatedAt: new Date('2025-04-04T13:00:00Z'),
    postCount: 2
  },
  {
    id: '7',
    name: '做30个俯卧撑或适合你的替代运动',
    description: '做30个俯卧撑或适合你的替代运动，增强上肢力量。',
    type: '运动',
    location: '任何地方',
    equipment: '无',
    energy: '高',
    duration: 10,
    createdAt: new Date('2025-04-05T14:00:00Z'),
    updatedAt: new Date('2025-04-05T14:00:00Z'),
    postCount: 3
  },
  {
    id: '8',
    name: '骑自行车兜风',
    description: '骑自行车兜风，享受自然风光，锻炼身体。',
    type: '运动',
    location: '室外',
    equipment: '自行车',
    energy: '高',
    duration: 45,
    createdAt: new Date('2025-04-06T15:00:00Z'),
    updatedAt: new Date('2025-04-06T15:00:00Z'),
    postCount: 4
  },
  {
    id: '9',
    name: '尝试做一道新菜',
    description: '尝试做一道新菜，享受烹饪的乐趣。',
    type: '创作',
    location: '室内',
    equipment: '厨房',
    energy: '中',
    duration: 60,
    createdAt: new Date('2025-04-07T16:00:00Z'),
    updatedAt: new Date('2025-04-07T16:00:00Z'),
    postCount: 2
  },
  {
    id: '10',
    name: '学习一首新歌或乐器片段',
    description: '学习一首新歌或乐器片段，提高音乐素养。',
    type: '学习',
    location: '任何地方',
    equipment: '乐器',
    energy: '中',
    duration: 30,
    createdAt: new Date('2025-04-08T17:00:00Z'),
    updatedAt: new Date('2025-04-08T17:00:00Z'),
    postCount: 3
  },
  {
    id: '11',
    name: '写日记或感恩日记',
    description: '写日记或感恩日记，记录生活点滴，表达感恩之情。',
    type: '创作',
    location: '任何地方',
    equipment: '笔纸',
    energy: '低',
    duration: 15,
    createdAt: new Date('2025-04-09T18:00:00Z'),
    updatedAt: new Date('2025-04-09T18:00:00Z'),
    postCount: 1
  },
  {
    id: '12',
    name: '参加当地社区活动或志愿者工作',
    description: '参加当地社区活动或志愿者工作，为社会贡献力量。',
    type: '社交',
    location: '室外',
    equipment: '无',
    energy: '高',
    duration: 120,
    createdAt: new Date('2025-04-10T19:00:00Z'),
    updatedAt: new Date('2025-04-10T19:00:00Z'),
    postCount: 5
  },
  {
    id: '13',
    name: '深度清洁家中一个房间',
    description: '深度清洁家中一个房间，创造一个整洁舒适的环境。',
    type: '放松',
    location: '室内',
    equipment: '清洁用品',
    energy: '高',
    duration: 60,
    createdAt: new Date('2025-04-11T20:00:00Z'),
    updatedAt: new Date('2025-04-11T20:00:00Z'),
    postCount: 3
  },
  {
    id: '14',
    name: '观看一部纪录片',
    description: '观看一部纪录片，了解世界，增长知识。',
    type: '学习',
    location: '室内',
    equipment: '电视',
    energy: '低',
    duration: 90,
    createdAt: new Date('2025-04-12T21:00:00Z'),
    updatedAt: new Date('2025-04-12T21:00:00Z'),
    postCount: 2
  },
  {
    id: '15',
    name: '尝试5分钟的冷水浴或冷水淋浴',
    description: '尝试5分钟的冷水浴或冷水淋浴，提高身体耐寒能力。',
    type: '放松',
    location: '室内',
    equipment: '淋浴',
    energy: '高',
    duration: 5,
    createdAt: new Date('2025-04-13T22:00:00Z'),
    updatedAt: new Date('2025-04-13T22:00:00Z'),
    postCount: 1
  },
]; 