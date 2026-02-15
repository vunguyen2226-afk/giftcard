export interface GreetingSuggestion {
  id: string
  text: string
  language: "en" | "vi"
  category: "formal" | "casual" | "funny" | "heartfelt"
}

export const GREETING_SUGGESTIONS: GreetingSuggestion[] = [
  // English - Formal
  {
    id: "en-formal-1",
    text: "Wishing you a year filled with joy, health, and prosperity!",
    language: "en",
    category: "formal",
  },
  {
    id: "en-formal-2",
    text: "May this New Year bring you peace, happiness, and success in all your endeavors.",
    language: "en",
    category: "formal",
  },
  {
    id: "en-formal-3",
    text: "As we welcome the New Year, I extend my warmest wishes for your continued success and well-being.",
    language: "en",
    category: "formal",
  },

  // English - Heartfelt
  {
    id: "en-heartfelt-1",
    text: "Happy New Year! May all your dreams come true in the coming year.",
    language: "en",
    category: "heartfelt",
  },
  {
    id: "en-heartfelt-2",
    text: "May this new year bring you laughter, love, and everything your heart desires.",
    language: "en",
    category: "heartfelt",
  },
  {
    id: "en-heartfelt-3",
    text: "Wishing you 365 days of happiness, laughter, and unforgettable memories!",
    language: "en",
    category: "heartfelt",
  },
  {
    id: "en-heartfelt-4",
    text: "Here's to new beginnings and cherished moments. Happy New Year!",
    language: "en",
    category: "heartfelt",
  },

  // English - Casual
  {
    id: "en-casual-1",
    text: "Cheers to new beginnings and wonderful memories ahead!",
    language: "en",
    category: "casual",
  },
  {
    id: "en-casual-2",
    text: "New year, new adventures! Let's make it the best one yet.",
    language: "en",
    category: "casual",
  },
  {
    id: "en-casual-3",
    text: "Happy New Year! Can't wait to see what amazing things this year brings!",
    language: "en",
    category: "casual",
  },

  // English - Funny
  {
    id: "en-funny-1",
    text: "New Year's resolution: to tolerate fools more gladly... starting tomorrow!",
    language: "en",
    category: "funny",
  },
  {
    id: "en-funny-2",
    text: "May your troubles last as long as your New Year's resolutions!",
    language: "en",
    category: "funny",
  },

  // Vietnamese - Formal
  {
    id: "vi-formal-1",
    text: "Chúc Mừng Năm Mới! Kính chúc an khang thịnh vượng, vạn sự như ý!",
    language: "vi",
    category: "formal",
  },
  {
    id: "vi-formal-2",
    text: "Năm mới chúc bạn và gia đình nhiều sức khỏe, hạnh phúc và thành công!",
    language: "vi",
    category: "formal",
  },
  {
    id: "vi-formal-3",
    text: "Kính chúc quý vị năm mới tràn đầy niềm vui, sức khỏe dồi dào, sự nghiệp thăng tiến!",
    language: "vi",
    category: "formal",
  },
  {
    id: "vi-formal-4",
    text: "Năm mới vạn sự như ý, sức khỏe dồi dào, công việc thuận lợi!",
    language: "vi",
    category: "formal",
  },

  // Vietnamese - Heartfelt
  {
    id: "vi-heartfelt-1",
    text: "Một năm mới tràn đầy niềm vui và những điều tốt đẹp nhất!",
    language: "vi",
    category: "heartfelt",
  },
  {
    id: "vi-heartfelt-2",
    text: "Chúc năm mới hạnh phúc bên người thân yêu, mọi điều ước đều thành hiện thực!",
    language: "vi",
    category: "heartfelt",
  },
  {
    id: "vi-heartfelt-3",
    text: "Năm mới chúc bạn luôn tràn đầy năng lượng tích cực và yêu thương!",
    language: "vi",
    category: "heartfelt",
  },

  // Vietnamese - Casual
  {
    id: "vi-casual-1",
    text: "Chúc bạn năm mới vui vẻ, nhiều niềm vui và tiếng cười!",
    language: "vi",
    category: "casual",
  },
  {
    id: "vi-casual-2",
    text: "Happy New Year! Chúc năm mới nhiều điều thú vị và bất ngờ thú vị nha!",
    language: "vi",
    category: "casual",
  },
  {
    id: "vi-casual-3",
    text: "Năm mới rồi! Chúc mình ta cùng vui vẻ và thành công nhé!",
    language: "vi",
    category: "casual",
  },

  // Vietnamese - Funny
  {
    id: "vi-funny-1",
    text: "Chúc bạn năm mới phát tài, tiền vào như nước!",
    language: "vi",
    category: "funny",
  },
  {
    id: "vi-funny-2",
    text: "Năm mới chúc ăn gì cũng ngon, làm gì cũng lãi!",
    language: "vi",
    category: "funny",
  },
  {
    id: "vi-funny-3",
    text: "Chúc năm mới không phải đi làm... à nhầm, làm gì cũng thành công!",
    language: "vi",
    category: "funny",
  },
]

// Helper functions for filtering suggestions
export function getGreetingsByLanguage(language: "en" | "vi"): GreetingSuggestion[] {
  return GREETING_SUGGESTIONS.filter((g) => g.language === language)
}

export function getGreetingsByCategory(category: GreetingSuggestion["category"]): GreetingSuggestion[] {
  return GREETING_SUGGESTIONS.filter((g) => g.category === category)
}

export function getGreetingById(id: string): GreetingSuggestion | undefined {
  return GREETING_SUGGESTIONS.find((g) => g.id === id)
}

export function getRandomGreeting(language?: "en" | "vi", category?: GreetingSuggestion["category"]): GreetingSuggestion {
  let filtered = GREETING_SUGGESTIONS

  if (language) {
    filtered = filtered.filter((g) => g.language === language)
  }

  if (category) {
    filtered = filtered.filter((g) => g.category === category)
  }

  const randomIndex = Math.floor(Math.random() * filtered.length)
  return filtered[randomIndex] || GREETING_SUGGESTIONS[0]
}
