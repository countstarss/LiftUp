import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 初始Action数据
const actionSeed = [
  {
    description: '散步20分钟，欣赏周围环境并深呼吸',
    type: 'outdoor',
    locationRequirement: 'outside',
    equipmentNeeded: 'none',
    estimatedDurationMinutes: 20,
    energyLevelRequired: 'low',
  },
  {
    description: '做15分钟的基础瑜伽伸展',
    type: 'indoor',
    locationRequirement: 'home',
    equipmentNeeded: 'yoga_mat',
    estimatedDurationMinutes: 15,
    energyLevelRequired: 'medium',
  },
  {
    description: '画一幅速写或涂鸦',
    type: 'creative',
    locationRequirement: 'anywhere',
    equipmentNeeded: 'pen_paper',
    estimatedDurationMinutes: 30,
    energyLevelRequired: 'low',
  },
  {
    description: '整理一个抽屉或小柜子',
    type: 'indoor',
    locationRequirement: 'home',
    equipmentNeeded: 'none',
    estimatedDurationMinutes: 20,
    energyLevelRequired: 'medium',
  },
  {
    description: '给一位久未联系的朋友发消息',
    type: 'social',
    locationRequirement: 'anywhere',
    equipmentNeeded: 'phone',
    estimatedDurationMinutes: 10,
    energyLevelRequired: 'low',
  },
  {
    description: '冥想10分钟',
    type: 'indoor',
    locationRequirement: 'anywhere',
    equipmentNeeded: 'none',
    estimatedDurationMinutes: 10,
    energyLevelRequired: 'low',
  },
  {
    description: '做30个俯卧撑或适合你的替代运动',
    type: 'indoor',
    locationRequirement: 'anywhere',
    equipmentNeeded: 'none',
    estimatedDurationMinutes: 10,
    energyLevelRequired: 'high',
  },
  {
    description: '骑自行车兜风',
    type: 'outdoor',
    locationRequirement: 'outside',
    equipmentNeeded: 'bicycle',
    estimatedDurationMinutes: 45,
    energyLevelRequired: 'high',
  },
  {
    description: '尝试做一道新菜',
    type: 'creative',
    locationRequirement: 'home',
    equipmentNeeded: 'kitchen',
    estimatedDurationMinutes: 60,
    energyLevelRequired: 'medium',
  },
  {
    description: '学习一首新歌或乐器片段',
    type: 'creative',
    locationRequirement: 'anywhere',
    equipmentNeeded: 'instrument',
    estimatedDurationMinutes: 30,
    energyLevelRequired: 'medium',
  },
  {
    description: '写日记或感恩日记',
    type: 'quick_win',
    locationRequirement: 'anywhere',
    equipmentNeeded: 'pen_paper',
    estimatedDurationMinutes: 15,
    energyLevelRequired: 'low',
  },
  {
    description: '参加当地社区活动或志愿者工作',
    type: 'social',
    locationRequirement: 'outside',
    equipmentNeeded: 'none',
    estimatedDurationMinutes: 120,
    energyLevelRequired: 'high',
  },
  {
    description: '深度清洁家中一个房间',
    type: 'indoor',
    locationRequirement: 'home',
    equipmentNeeded: 'cleaning_supplies',
    estimatedDurationMinutes: 60,
    energyLevelRequired: 'high',
  },
  {
    description: '观看一部纪录片',
    type: 'indoor',
    locationRequirement: 'home',
    equipmentNeeded: 'tv',
    estimatedDurationMinutes: 90,
    energyLevelRequired: 'low',
  },
  {
    description: '尝试5分钟的冷水浴或冷水淋浴',
    type: 'indoor',
    locationRequirement: 'home',
    equipmentNeeded: 'shower',
    estimatedDurationMinutes: 5,
    energyLevelRequired: 'high',
  },
];

async function main() {
  console.log('开始种子数据初始化...');

  // 清空现有数据（如果需要）
  await prisma.post.deleteMany();
  await prisma.action.deleteMany();

  // 创建Action记录
  for (const actionData of actionSeed) {
    await prisma.action.create({
      data: actionData,
    });
  }

  console.log('数据库种子数据已成功初始化！');
}

main()
  .catch((e) => {
    console.error('种子数据初始化过程中出错:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 