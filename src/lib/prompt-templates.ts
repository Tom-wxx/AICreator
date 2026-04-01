export interface PromptTemplate {
  id: string;
  title: string;
  description: string;
  prompt: string;
  category: "image" | "video" | "content";
  tags: string[];
  icon: string;
}

export const promptTemplates: PromptTemplate[] = [
  // ── Image Generation ──
  {
    id: "img-product-shot",
    title: "产品展示图",
    description: "为电商产品生成专业的展示图片",
    prompt:
      "A professional product photography shot of {product}, studio lighting, white background, high detail, commercial quality, 8K resolution",
    category: "image",
    tags: ["电商", "产品", "商业"],
    icon: "ShoppingBag",
  },
  {
    id: "img-landscape",
    title: "风景壁纸",
    description: "生成震撼的自然风景壁纸",
    prompt:
      "A breathtaking landscape of {scene}, golden hour lighting, dramatic clouds, ultra-wide angle, cinematic composition, photorealistic, 4K wallpaper",
    category: "image",
    tags: ["风景", "壁纸", "自然"],
    icon: "Mountain",
  },
  {
    id: "img-avatar",
    title: "人物头像",
    description: "生成独特的人物插画头像",
    prompt:
      "A stylized portrait avatar of {description}, digital illustration, vibrant colors, clean lines, character design, trending on ArtStation",
    category: "image",
    tags: ["头像", "插画", "人物"],
    icon: "User",
  },
  {
    id: "img-logo",
    title: "Logo 设计",
    description: "生成简洁现代的品牌 Logo",
    prompt:
      "A minimalist modern logo design for {brand}, clean vector style, professional, scalable, on white background, graphic design",
    category: "image",
    tags: ["Logo", "品牌", "设计"],
    icon: "Palette",
  },
  {
    id: "img-illustration",
    title: "概念插图",
    description: "创作富有想象力的概念艺术",
    prompt:
      "A concept art illustration of {concept}, detailed digital painting, dramatic lighting, epic composition, fantasy art style",
    category: "image",
    tags: ["插图", "概念艺术", "创意"],
    icon: "Paintbrush",
  },
  {
    id: "img-food",
    title: "美食摄影",
    description: "生成令人垂涎的美食摄影图",
    prompt:
      "Professional food photography of {dish}, overhead angle, warm natural lighting, rustic wooden table, garnished beautifully, shallow depth of field",
    category: "image",
    tags: ["美食", "摄影", "餐饮"],
    icon: "UtensilsCrossed",
  },
  {
    id: "img-interior",
    title: "室内设计",
    description: "生成现代室内空间效果图",
    prompt:
      "A modern interior design visualization of {room}, Scandinavian style, natural materials, large windows with natural light, architectural photography, 4K",
    category: "image",
    tags: ["室内", "设计", "空间"],
    icon: "Home",
  },

  // ── Video Generation ──
  {
    id: "vid-product-demo",
    title: "产品演示",
    description: "为产品创建动态展示视频",
    prompt:
      "A smooth rotating product showcase video of {product}, studio lighting, dark background, slow motion reveal, professional product demo, 4K",
    category: "video",
    tags: ["产品", "演示", "商业"],
    icon: "Play",
  },
  {
    id: "vid-nature-scene",
    title: "自然场景",
    description: "生成宁静的自然风光视频",
    prompt:
      "A serene nature scene video of {scene}, gentle camera movement, ambient sound design, golden hour, cinematic 4K, slow motion",
    category: "video",
    tags: ["自然", "风景", "放松"],
    icon: "TreePine",
  },
  {
    id: "vid-motion-graphics",
    title: "动态图形",
    description: "创建现代感动态图形动画",
    prompt:
      "Modern motion graphics animation showing {concept}, smooth transitions, vibrant colors, minimalist design, professional quality, looping",
    category: "video",
    tags: ["动画", "图形", "现代"],
    icon: "Sparkles",
  },
  {
    id: "vid-text-animation",
    title: "文字动画",
    description: "生成酷炫的文字动效视频",
    prompt:
      "Cinematic text reveal animation of '{text}', dark background, neon glow effects, particle effects, dynamic camera, 4K",
    category: "video",
    tags: ["文字", "动画", "特效"],
    icon: "Type",
  },

  // ── Content Writing ──
  {
    id: "content-blog",
    title: "博客文章",
    description: "撰写引人入胜的博客文章",
    prompt:
      "撰写一篇关于「{topic}」的深度博客文章。要求：结构清晰、有数据支撑、包含实际案例、语言生动有趣、适合在线阅读。字数约 1500 字。",
    category: "content",
    tags: ["博客", "文章", "写作"],
    icon: "FileText",
  },
  {
    id: "content-social",
    title: "社交媒体文案",
    description: "创作吸引眼球的社交媒体内容",
    prompt:
      "为{platform}平台撰写关于「{topic}」的推广文案。要求：吸引注意力的开头、简洁有力、包含行动号召、适当使用 emoji、附带相关话题标签。",
    category: "content",
    tags: ["社交", "文案", "营销"],
    icon: "MessageCircle",
  },
  {
    id: "content-email",
    title: "营销邮件",
    description: "编写高转化率的营销邮件",
    prompt:
      "撰写一封关于「{topic}」的营销邮件。要求：引人注目的主题行、个性化开场、清晰的价值主张、强有力的行动号召、专业但友好的语气。",
    category: "content",
    tags: ["邮件", "营销", "转化"],
    icon: "Mail",
  },
  {
    id: "content-product-desc",
    title: "产品描述",
    description: "为产品撰写有吸引力的描述",
    prompt:
      "为产品「{product}」撰写电商产品详情描述。要求：突出核心卖点、包含使用场景、运用感官描述、引导购买决策。分段清晰，适合手机阅读。",
    category: "content",
    tags: ["产品", "描述", "电商"],
    icon: "Package",
  },
  {
    id: "content-script",
    title: "短视频脚本",
    description: "创作短视频/直播脚本",
    prompt:
      "为一个关于「{topic}」的短视频撰写脚本。要求：时长约 {duration} 秒，前 3 秒抓住注意力，节奏紧凑，包含画面描述和旁白/字幕文案，结尾有互动引导。",
    category: "content",
    tags: ["脚本", "视频", "创作"],
    icon: "Film",
  },
  {
    id: "content-seo",
    title: "SEO 优化文案",
    description: "撰写搜索引擎优化友好的文案",
    prompt:
      "围绕关键词「{keyword}」撰写一篇 SEO 优化文章。要求：自然融入关键词及长尾词、结构化标题层次、段落适合扫读、包含内链建议、meta description。约 1000 字。",
    category: "content",
    tags: ["SEO", "优化", "搜索"],
    icon: "Search",
  },
  {
    id: "content-translation",
    title: "翻译润色",
    description: "将内容翻译并进行本地化润色",
    prompt:
      "将以下内容翻译为{targetLang}，并进行本地化润色，使其自然流畅、符合目标语言的表达习惯。保持原文的语气和风格。\n\n原文：{text}",
    category: "content",
    tags: ["翻译", "润色", "多语言"],
    icon: "Languages",
  },
];

export const templateCategories = [
  { id: "all" as const, label: "全部", icon: "LayoutGrid" },
  { id: "image" as const, label: "图片生成", icon: "Image" },
  { id: "video" as const, label: "视频生成", icon: "Video" },
  { id: "content" as const, label: "内容创作", icon: "PenTool" },
];

export type TemplateCategory = "all" | "image" | "video" | "content";
