// 情绪类型定义
export type EmotionType = 'exhaustion' | 'anxiety' | 'confusion' | 'loneliness' | 'relationship'

// 梦境物件定义
export interface DreamObject {
  id: string
  name: string
  description: string
  responseText: string
  icon: string // SVG 路径或标识
}

// 场景配置
export interface SceneConfig {
  id: string
  title: string
  atmosphere: string
  ambientText: string[]
  primaryObject?: DreamObject
  secondaryObject?: DreamObject
}

// 故事线配置 - 每种情绪对应完整的物件链和文案
export interface StorylineConfig {
  emotion: EmotionType
  label: string
  // 第一层：雨中站台
  platform: {
    object: DreamObject
    broadcast: string
    atmosphereText: string
  }
  // 第二层：无声车厢
  carriage: {
    object: DreamObject
    responseText: string
    atmosphereText: string
  }
  // 第三层：失物信箱
  letterbox: {
    depositAction: string
    depositResponse: string
    atmosphereText: string
  }
  // 终章：醒来
  awakening: {
    texts: string[]
    finalThought: string
  }
}

// 完整的故事线数据
export const STORYLINES: Record<EmotionType, StorylineConfig> = {
  exhaustion: {
    emotion: 'exhaustion',
    label: '疲惫',
    platform: {
      object: {
        id: 'umbrella',
        name: '旧伞',
        description: '一把撑开的旧伞，伞面有些褪色',
        responseText: '你接过这把伞。它比你想象的重。',
        icon: 'umbrella',
      },
      broadcast: '各位旅客请注意，开往休息站的列车即将进站。请放下手中沉重的行李……',
      atmosphereText: '雨下得很大。站台空无一人，只有一盏昏灯，和一把被遗忘的伞。',
    },
    carriage: {
      object: {
        id: 'shadow',
        name: '影子',
        description: '座位上有一个深色的影子，形状像是一个弯着腰的人',
        responseText: '影子动了动，让出了一半位置。\n「坐吧。你已经站了很久了。」',
        icon: 'shadow',
      },
      responseText: '',
      atmosphereText: '车厢在摇晃。你的影子坐在对面，看起来比你还累。',
    },
    letterbox: {
      depositAction: '收起旧伞，放进信箱',
      depositResponse: '伞被收起来了。雨声变小了。\n有些重量，不必一直扛着。',
      atmosphereText: '失物招领处很暖和。墙上挂满了别人留下的东西。',
    },
    awakening: {
      texts: [
        '你睁开眼。',
        '雨停了。',
        '那把伞留在了梦里。',
        '但你可以把手放下来了。',
      ],
      finalThought: '你不必一直撑着。',
    },
  },

  anxiety: {
    emotion: 'anxiety',
    label: '焦虑',
    platform: {
      object: {
        id: 'lantern',
        name: '路灯',
        description: '一盏忽明忽暗的路灯，灯光微弱',
        responseText: '路灯闪烁了一下，似乎想亮起来，又犹豫了。',
        icon: 'lantern',
      },
      broadcast: '前方路段照明不足，请旅客注意脚下。能见度较低时，请相信路还在……',
      atmosphereText: '雾很浓。站台边缘模糊不清，只有一盏灯在努力发光。',
    },
    carriage: {
      object: {
        id: 'fog-window',
        name: '雾窗',
        description: '车窗上蒙着一层厚厚的雾，看不清外面',
        responseText: '你在雾气上画了一道线。\n雾散开了一角，露出一点光。\n「光一直在那里。」',
        icon: 'fog',
      },
      responseText: '',
      atmosphereText: '窗外什么都看不见。但车在往前走。',
    },
    letterbox: {
      depositAction: '把擦亮的窗口放进信箱',
      depositResponse: '那一角光被保存了下来。\n下次看不清的时候，记得——光没有消失，只是被挡住了。',
      atmosphereText: '失物招领处。玻璃柜里装着许多人的光。',
    },
    awakening: {
      texts: [
        '你醒了。',
        '房间很亮。',
        '那些让你害怕的事，大多没有发生。',
        '就算发生了，你也比想象的更能应对。',
      ],
      finalThought: '光会亮起来的。',
    },
  },

  confusion: {
    emotion: 'confusion',
    label: '迷茫',
    platform: {
      object: {
        id: 'ticket',
        name: '空白车票',
        description: '一张泛黄的车票，上面没有写目的地',
        responseText: '你拿起车票。背面浮现出一行字：\n「车会来的。你不需要知道它从哪来。」',
        icon: 'ticket',
      },
      broadcast: '开往未知方向的列车即将到站。未持票旅客请前往售票处……不，票在你手里了。',
      atmosphereText: '站台上空荡荡的。时刻表上所有的字都模糊了，只有这张车票是清楚的。',
    },
    carriage: {
      object: {
        id: 'schedule',
        name: '时刻表',
        description: '一本翻开的时刻表，页面上只有一行字在慢慢显现',
        responseText: '时刻表上的字终于清晰了：\n「下一站：你会知道的。」\n\n你不知道那是哪里。\n但你知道车在带你去那里。',
        icon: 'schedule',
      },
      responseText: '',
      atmosphereText: '车厢里很安静。时刻表的字一个一个地出现，像是有人在对你说。',
    },
    letterbox: {
      depositAction: '把车票贴在留言墙上',
      depositResponse: '车票贴好了。\n旁边还有别人留下的票。\n他们也不知道要去哪。\n但他们都到了。',
      atmosphereText: '失物招领处有一面墙，贴满了没有目的地的车票。',
    },
    awakening: {
      texts: [
        '你醒来了。',
        '窗外有光。',
        '你仍然不知道所有答案。',
        '但你已经在上路了。',
      ],
      finalThought: '车会来的。',
    },
  },

  loneliness: {
    emotion: 'loneliness',
    label: '孤独',
    platform: {
      object: {
        id: 'envelope',
        name: '旧信封',
        description: '一个没封口的信封，里面似乎有东西',
        responseText: '你打开信封。里面是一张纸，上面写着：\n「有人会读到的。」',
        icon: 'envelope',
      },
      broadcast: '请携带重要物品上车。遗落的心事可在下一站失物招领处领取……',
      atmosphereText: '站台很安静。长椅上放着一个信封，像是有人在等，又像是被人忘了。',
    },
    carriage: {
      object: {
        id: 'empty-seat',
        name: '空座位',
        description: '对面的座位空着，但座垫上有一个浅浅的凹痕',
        responseText: '那个凹痕还在。\n像是有人刚刚离开，或是即将到来。\n\n「座位给你留着。」——不知是谁的声音。',
        icon: 'seat',
      },
      responseText: '',
      atmosphereText: '车厢里只有你一个人。但那个空座位，让人觉得并不孤单。',
    },
    letterbox: {
      depositAction: '把信投进邮筒',
      depositResponse: '信落入筒底的声音很轻。\n\n「寄出去了。」\n你不知道它会到哪里。\n但它已经在路上了。',
      atmosphereText: '失物招领处有一个老式邮筒，漆掉了不少，但还能用。',
    },
    awakening: {
      texts: [
        '你慢慢醒来。',
        '阳光照在被子上。',
        '那些说不出口的话，梦帮你寄走了。',
        '总有人会读懂的。',
      ],
      finalThought: '有人会读到的。',
    },
  },

  relationship: {
    emotion: 'relationship',
    label: '关系困扰',
    platform: {
      object: {
        id: 'mirror',
        name: '碎镜',
        description: '一面裂开的镜子，碎片还勉强拼在一起',
        responseText: '镜子里的倒影转过头来看你。\n不是别人的脸。\n是你自己的。',
        icon: 'mirror',
      },
     broadcast: '请保管好随身物品。易碎品请轻拿轻放。破碎的东西可以修补，只是需要一点时间……',
      atmosphereText: '站台边立着一面镜子。它碎了，但没有完全散架。每一片里都有不同的画面。',
    },
    carriage: {
      object: {
        id: 'reflection',
        name: '窗中倒影',
        description: '车窗玻璃上映出两个人的轮廓，但其中一个在慢慢变淡',
        responseText: '倒影里的那个人影模糊了一下，然后又清晰了。\n\n「玻璃脏了，不是人走了。」\n你下意识伸手去擦。',
        icon: 'reflection',
      },
      responseText: '',
      atmosphereText: '车窗上的倒影随着车身晃动。有时候清楚，有时候模糊。',
    },
    letterbox: {
      depositAction: '把拼好的镜子放进柜子',
      depositResponse: '镜子放进去了。\n裂纹还在，但它又能照出完整的样子了。\n\n裂痕也是一种纹路。',
      atmosphereText: '失物招领处的柜子里，许多破碎的东西都被修好了。',
    },
    awakening: {
      texts: [
        '你醒了。',
        '天亮了。',
        '关系像镜子，裂了可以补。',
        '补过的镜子，照样能照见光。',
      ],
      finalThought: '玻璃可以擦亮的。',
    },
  },
}
