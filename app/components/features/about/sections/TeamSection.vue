<template>
  <section id="team" class="py-20">
    <div class="container mx-auto px-4 lg:px-6">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-3xl lg:text-4xl font-bold text-secondary mb-6">
            {{ t('about.team.title') }}
          </h2>
          <p class="text-lg text-gray-600 max-w-3xl mx-auto">
            {{ t('about.team.subtitle') }}
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="member in teamMembers"
            :key="member.id"
            class="bg-white rounded-2xl shadow-custom overflow-hidden hover-lift"
          >
            <div class="relative">
              <img :src="member.photo" :alt="member.name" class="w-full h-64 object-cover" />
              <div class="absolute bottom-4 left-4 bg-white rounded-lg px-3 py-1">
                <span class="text-sm font-medium text-primary">{{ member.role }}</span>
              </div>
            </div>
            <div class="p-6">
              <h3 class="text-xl font-semibold text-secondary mb-2">{{ member.name }}</h3>
              <p class="text-gray-600 mb-4">{{ member.position }}</p>
              <p class="text-sm text-gray-500 leading-relaxed mb-4">
                {{ member.description }}
              </p>
              <div v-if="member.linkedin || member.whatsapp" class="flex space-x-3">
                <a
                  v-if="member.linkedin"
                  :href="member.linkedin"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center cursor-pointer"
                >
                  <Icon name="mdi:linkedin" class="text-blue-600" />
                </a>
                <a
                  v-if="member.whatsapp"
                  :href="`https://wa.me/${member.whatsapp}`"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center cursor-pointer"
                >
                  <Icon name="mdi:whatsapp" class="text-green-600" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { t } = useI18n()

interface TeamMember {
  id: number
  name: string
  position: string
  role: string
  description: string
  photo: string
  linkedin?: string
  whatsapp?: string
}

const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: 'Адам Зугираев',
    position: 'Ведущий backend-разработчик',
    role: 'Backend',
    description:
      'Мастерит платформу для лёгкого прорыва в вуз — без лагов, с умными тестами и фокусом на твою победу.',
    photo: '/images/team/adam-zugiraev.jpeg',
    linkedin: 'https://www.linkedin.com/in/adam-zugiraev/',
  },
  {
    id: 2,
    name: 'Туран Лалаев',
    position: 'Преподаватель TR-YÖS',
    role: 'TR-YÖS',
    description:
      'Уже более 5 лет я преподаю и готовлю учеников к TR-YÖS. За это время я сам прошёл через более чем 20 экзаменов (YÖS и TR-YÖS), поэтому прекрасно понимаю их структуру и требования. Сейчас я учусь на 2-м курсе медицинского факультета. Это помогает мне быть максимально дисциплинированным, организованным и ответственным как в учёбе, так и в преподавании. Я отношусь к обучению очень серьёзно: моя цель — не просто дать готовые ответы, а объяснить материал так, чтобы ученик сам понимал логику заданий и мог уверенно решать даже сложные вопросы.',
    photo: '/images/team/turan-lalaev.jpg',
  },
  {
    id: 3,
    name: 'Назрин Иманова',
    position: 'Консультант и куратор студентов',
    role: 'Консультант',
    description:
      'Я — Назрин Иманова, консультант и куратор студентов агентства. С 2022 года живу в Стамбуле и обучаюсь в магистратуре İstanbul Aydın University по направлению Business Administration. Так как я сама прошла путь иностранного студента, я отлично понимаю, с какими трудностями сталкиваются ребята при переезде, и знаю, как сделать этот процесс проще и комфортнее. В своей работе я делаю акцент на ответственности, внимательности к деталям и качественном сопровождении, чтобы каждый студент чувствовал поддержку и уверенность в новой стране. Помимо консультационной деятельности, я активно интересуюсь вопросами межкультурной адаптации и международного образования, что помогает мне ещё лучше понимать потребности студентов и находить для них правильные решения.',
    photo: '/images/team/nazrin-imanova.jpg',
  },
  {
    id: 4,
    name: 'Хаким Нагаев',
    position: 'Основатель агентства Edu.turkish',
    role: 'Основатель',
    description:
      'Я - основатель агентства, которое помогает иностранным студентам поступать в университеты Турции и адаптироваться к жизни в новой стране. С 2017 года живу в Стамбуле и хорошо знаю особенности местной образовательной системы и студенческой жизни.\n\nВ настоящее время я учусь на последнем курсе в İstanbul Sabahattin Zaim Üniversitesi по направлению Исламские науки. Мой личный опыт студента и многолетнее пребывание в Турции помогают мне лучше понимать потребности и трудности иностранных студентов.\n\nМоя цель - сделать процесс поступления и полного обустройства максимально легким и простым: От выбора университета до оформления всех необходимых документов и адаптации в Турции. Я стремлюсь предоставлять только актуальную информацию и сопровождать студентов на каждом этапе их пути.',
    photo: '/images/team/hakim-nagayev.jpg',
  },
]
</script>

<style scoped>
.shadow-custom {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.hover-lift {
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}
</style>
