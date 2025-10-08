import type { PrismaClient, ReviewType, MediaReviewType } from '@prisma/client'

type SeedReview = {
  type: ReviewType
  mediaType?: MediaReviewType
  rating: number
  year?: number
  name: string
  university: string
  quote: string
  avatar?: string
  videoUrl?: string
  videoThumb?: string
  videoDuration?: string
  imageUrl?: string
}

const studentReviews: SeedReview[] = [
  {
    type: 'student',
    mediaType: 'text',
    rating: 5,
    year: 2025,
    name: 'Мама Расула',
    university: 'Tekirdağ Namik Kemal University',
    quote:
      'У меня случилась очень неприятная история с поступлением в Турцию: 2 года подряд нас обманывали на деньги, обещая зачисления, но желанного результата так и не было! Эта девушка (Nazrin) откликнулась на мою просьбу в чате и написала, что готова помочь. И удивило то, что эта прекрасная девушка не попросила ничего взамен. Я была глубоко удивлена и приятно рада, что есть такие люди, которые не проходят мимо чужой беды. Я безмерно благодарна Аллаху за таких людей! Даже если мы не поступим, я очень рада за сочувствие и понимание! Спасибо большое, пусть Аллах дарует вам большее, чем сделали вы от души!',
  },
  {
    type: 'student',
    mediaType: 'video',
    rating: 5,
    year: 2025,
    name: 'Студент 1',
    university: 'İstanbul University',
    quote: 'Видео отзыв о поступлении и обучении',
    videoUrl: 'https://cdn.edu-turkish.com/videos/reviews/video_2025-09-28_17-31-55.mp4',
    videoThumb: 'https://cdn.edu-turkish.com/images/reviews/thumbnails/video_2025-09-28_17-31-55.png',
  },
  {
    type: 'student',
    mediaType: 'video',
    rating: 5,
    year: 2025,
    name: 'Студент 2',
    university: 'Marmara University',
    quote: 'Отзыв о процессе поступления',
    videoUrl: 'https://cdn.edu-turkish.com/videos/reviews/video_2025-09-28_17-31-59.mp4',
    videoThumb: 'https://cdn.edu-turkish.com/images/reviews/thumbnails/video_2025-09-28_17-31-59.png',
  },
  {
    type: 'student',
    mediaType: 'video',
    rating: 5,
    year: 2025,
    name: 'Студент 3',
    university: 'Bahçeşehir University',
    quote: 'Видео отзыв родителя о поступлении ребенка',
    videoUrl: 'https://cdn.edu-turkish.com/videos/reviews/IMG_9552.MP4',
    videoThumb: 'https://cdn.edu-turkish.com/images/reviews/thumbnails/IMG_9552.png',
  },
  {
    type: 'student',
    mediaType: 'image',
    rating: 5,
    year: 2025,
    name: 'Студент 2',
    university: 'Beykent University',
    quote: 'Фото с университетского кампуса',
    imageUrl: 'https://cdn.edu-turkish.com/images/reviews/photo_2025-09-28_17-32-20.jpg',
  },
  {
    type: 'student',
    mediaType: 'image',
    rating: 5,
    year: 2025,
    name: 'Студент 4',
    university: 'Bahçeşehir University',
    quote: 'Момент из студенческой жизни',
    imageUrl: 'https://cdn.edu-turkish.com/images/reviews/photo_2025-09-28_17-32-26.jpg',
  },
  {
    type: 'student',
    mediaType: 'image',
    rating: 5,
    year: 2025,
    name: 'Студент 5',
    university: 'İstanbul Kultur University',
    quote: 'Фото с мероприятия в университете',
    imageUrl: 'https://cdn.edu-turkish.com/images/reviews/photo_2025-09-28_17-32-30.jpg',
  },
  // {
  //   type: 'student',
  //   rating: 5,
  //   name: '(не указано)',
  //   year: 2025,
  //   university: 'Beykent University',
  //   quote:
  //     'Может я не по теме, но я бы хотела написать слова благодарности девушке, имени даже не знаю (Nazrin | Education in Turkey — это её имя в телеграмме). У меня случилась очень неприятная история с поступлением в Турцию: 2 года подряд нас обманывали на деньги, обещая зачисления, но желанного результата так и не было! Эта девушка откликнулась на мою просьбу в этом чате и написала мне, что готова помочь, и удивило то, что эта прекрасная девушка не попросила ничего взамен. Я была глубоко удивлена и приятно рада, что есть такие люди, не проходящие мимо чужой беды. Я безмерно благодарна Аллаху за таких людей! Даже если мы не поступим, я очень рада за сочувствие и понимание. Спасибо большое, пусть Аллах дарует вам большее, чем сделали вы от души!',
  // },
  {
    type: 'student',
    mediaType: 'text',
    rating: 5,
    year: 2025,
    name: 'Ислам Эльмурзаев',
    university: 'Beykent University',
    quote:
      'Я поступил в Beykent университет 3 года назад, благодаря edu.turkish. Меня курировал и в целом устраивал Хаким, так как мой родственник его мне посоветовал. Я обращался в другие агентства, но слышал, что они кидают людей, было много негативных историй, и поэтому решил сделать так, как родственник сказал. Всё сделал через Хакима, через edu.turkish. Мы с ним ходили в течение двух недель, оформляли все документы — точнее, он всё оформлял, а я просто рядом был. Он очень ответственный человек, ко всему относился серьёзно. По сей день помогает, всё делает честно и от души, максимально старается. Поэтому советую именно в edu.turkish обращаться. Отличный агент. Рад, что познакомился с Хакимом и всей командой, и рад, что подавал документы именно через них.',
  },
]

const parentReviews: SeedReview[] = [
  {
    type: 'parent',
    mediaType: 'text',
    rating: 5,
    year: 2025,
    name: 'Римма, мама Султана',
    university: 'İstanbul Kultur University',
    quote:
      'Салам алейкум всем✋Здравствуйте! Когда начала искать альтернативу обучения сыну вне России, первая группа в тг была именно Hakima и Nazrin. Списались в апреле, договорились, что я им пишу, как получит аттестат. Они берут все сопровождение на себя, мое дело — подготовить документы. Я потеряла все свои контакты, получаем аттестат, и мне пишет Nazrin. Я ей обрадовалась, как-будто выиграла лотерею. Всё закрутилось, завертелось, были на связи постоянно. Перевела деньги за обучение, за общежитие половину суммы и даже мысли не возникло, что меня могли обмануть. При этом такие вопросы среди родни: «А ты их хорошо знаешь?» Конечно, знаю. А у самой мысли — ага, знаю по телефону. Я рада, что познакомилась с вами, мне почему-то было спокойно с первого знакомства. И как на дураков смотрела, когда у меня спрашивали: «А почему ты обратилась к ним, не ищешь ещё людей?» Считаю, если я договорилась, то всё! К моему счастью мне попались такие же люди, которые считают, что доверие стоит многого. Может написано сумбурно, но от души. Рада, что познакомилась.',
  },
  {
    type: 'parent',
    mediaType: 'image',
    rating: 5,
    year: 2025,
    name: 'Родитель 2',
    university: 'İstanbul University',
    quote: 'Благодарность за помощь в поступлении',
    imageUrl: 'https://cdn.edu-turkish.com/images/reviews/photo_2025-09-28_17-32-48.jpg',
  },
  {
    type: 'parent',
    mediaType: 'image',
    rating: 5,
    year: 2025,
    name: 'Родитель 4',
    university: 'Beykent University',
    quote: 'Рекомендация агентства',
    imageUrl: 'https://cdn.edu-turkish.com/images/reviews/photo_2025-09-28_17-32-56.jpg',
  },
  {
    type: 'parent',
    mediaType: 'image',
    rating: 5,
    year: 2025,
    name: 'Родитель 5',
    university: 'Tekirdağ Namik Kemal University',
    quote: 'Спасибо за профессиональную работу',
    imageUrl: 'https://cdn.edu-turkish.com/images/reviews/photo_2025-09-28_17-32-58.jpg',
  },
  {
    type: 'parent',
    mediaType: 'text',
    rating: 5,
    year: 2025,
    name: 'Елена, мама Дарины',
    university: '',
    quote:
      'Хаким, добрый день! Спасибо за беспокойство. Дарина, наверное, рассказала, что заболела, но сейчас значительно лучше. Вам огромное-огромное спасибо за работу!!! Всё сделал, во всем помог, она бы одна точно не справилась. Поэтому от меня лично низкий поклон! Теперь дальнейшие действия какие? Ждём карточку, идите опять вместе в банк, оформляете ей карту и она производит полный расчёт. Как и договорились. Уже великая победа, я считаю, что документы приняли с первого раза. Столько людей ходят по кругу, а у вас всё чётко. Вот что значит, когда человек подходит ответственно, знает все тонкости и чётко выполняет свою работу. Ещё и ещё раз большое спасибо!',
  },
  {
    type: 'parent',
    mediaType: 'text',
    rating: 5,
    year: 2025,
    name: 'Мама Зарины',
    university: '',
    quote:
      'Добрый день, Хаким. Это мама Зарины. Хочу ещё раз вас поблагодарить за вашу помощь и поддержку! Спасибо за отзывчивость и сострадание! Дай Аллах здоровья вам и вашим близким!',
  },
]

export async function seedReviews(prisma: PrismaClient) {
  const reviews = [...studentReviews, ...parentReviews]

  for (const review of reviews) {
    // Auto-detect mediaType based on media fields
    let mediaType: 'text' | 'video' | 'image' = review.mediaType || 'text'

    // If has video, it's a video review
    if (review.videoUrl) {
      mediaType = 'video'
    }
    // If has image (but no video), it's an image review
    else if (review.imageUrl) {
      mediaType = 'image'
    }

    const isFeatured = true

    await prisma.universityReview.create({
      data: {
        type: review.type,
        mediaType,
        year: review.year,
        rating: review.rating,
        featured: isFeatured,
        avatar: review.avatar,
        videoUrl: review.videoUrl,
        videoThumb: review.videoThumb,
        videoDuration: review.videoDuration,
        imageUrl: review.imageUrl,
        translations: {
          create: {
            locale: 'ru',
            name: review.name,
            quote: review.quote,
            universityName: review.university,
          },
        },
      },
    })
  }
}
