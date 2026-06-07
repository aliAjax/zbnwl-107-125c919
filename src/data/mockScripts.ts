import type { Script } from '@/types';

export const mockScripts: Script[] = [
  {
    id: 'script-1',
    name: '雾都迷案',
    type: '推理',
    difficulty: 4,
    duration: 240,
    minPlayers: 5,
    maxPlayers: 7,
    description: '19世纪伦敦，迷雾笼罩的城市中发生了一系列离奇命案。玩家扮演侦探，抽丝剥茧寻找真相。',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=mysterious%20foggy%20london%20street%20victorian%20era%20dark%20atmosphere&image_size=square_hd',
    tags: ['强推理']
  },
  {
    id: 'script-2',
    name: '夜半钟声',
    type: '恐怖',
    difficulty: 3,
    duration: 180,
    minPlayers: 4,
    maxPlayers: 6,
    description: '古老的钟楼每到午夜便会响起诡异的钟声，而你们被困在这座钟楼里，必须在天亮前逃出去。',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=haunted%20clock%20tower%20midnight%20dark%20horror%20atmosphere&image_size=square_hd',
    tags: ['微恐']
  },
  {
    id: 'script-3',
    name: '时光情书',
    type: '情感',
    difficulty: 2,
    duration: 210,
    minPlayers: 6,
    maxPlayers: 8,
    description: '跨越时空的爱情故事，三对恋人在不同年代的相遇与错过。准备好纸巾，这是一个催泪的故事。',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=romantic%20vintage%20love%20letters%20soft%20warm%20lighting%20nostalgic&image_size=square_hd',
    tags: ['新手友好']
  },
  {
    id: 'script-4',
    name: '欢乐派对',
    type: '欢乐',
    difficulty: 1,
    duration: 150,
    minPlayers: 6,
    maxPlayers: 10,
    description: '一场荒诞有趣的生日派对，各种搞笑角色轮番登场。适合新手和团建，轻松愉快无压力。',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=colorful%20birthday%20party%20confetti%20balloons%20celebration%20fun&image_size=square_hd',
    tags: ['新手友好', '适合团建']
  },
  {
    id: 'script-5',
    name: '三国风云',
    type: '阵营',
    difficulty: 5,
    duration: 300,
    minPlayers: 8,
    maxPlayers: 12,
    description: '东汉末年，群雄逐鹿。玩家分属魏蜀吴三大阵营，尔虞我诈，逐鹿中原。高玩推荐！',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=ancient%20chinese%20three%20kingdoms%20battlefield%20epic%20historical&image_size=square_hd',
    tags: ['强推理', '适合团建']
  },
  {
    id: 'script-6',
    name: '深海遗踪',
    type: '推理',
    difficulty: 4,
    duration: 240,
    minPlayers: 5,
    maxPlayers: 7,
    description: '一艘深海科考船在太平洋底发现了神秘遗迹，队员却接连失踪。海底两万里的惊魂之旅。',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=deep%20ocean%20submarine%20mysterious%20underwater%20ruins%20dark%20blue&image_size=square_hd',
    tags: ['强推理']
  }
];
