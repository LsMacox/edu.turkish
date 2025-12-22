<template>
  <div class="min-h-screen bg-gray-50 section-py-lg">
    <div class="container mx-auto px-4 max-w-6xl">
      <h1 class="text-3xl font-bold text-secondary mb-2">UI Showcase - Fields</h1>
      <p class="text-gray-600 mb-12">Все виды полей ввода, используемых в приложении</p>

      <!-- TEXT FIELDS SECTION -->
      <section class="mb-16">
        <h2 class="text-2xl font-bold text-secondary mb-8 pb-4 border-b border-gray-200">
          Текстовые поля (BaseTextField)
        </h2>

        <!-- Basic Text Fields -->
        <div class="mb-12">
          <h3 class="text-lg font-semibold text-gray-700 mb-4">Базовые текстовые поля</h3>
          <p class="text-sm text-gray-500 mb-4">Используется в: ApplicationModal, ShareExperienceForm</p>
          <div class="bg-white rounded-xl p-6 shadow-sm space-y-6">
            <div class="grid md:grid-cols-2 gap-6">
              <BaseTextField
                v-model="textFieldValue"
                label="Имя"
                placeholder="Введите ваше имя"
                required
              />
              <BaseTextField
                v-model="emailValue"
                type="email"
                label="Email"
                placeholder="example@mail.com"
              />
            </div>
            <div class="grid md:grid-cols-2 gap-6">
              <BaseTextField
                v-model="phoneValue"
                type="tel"
                label="Телефон"
                placeholder="+7 (999) 999-99-99"
              />
              <BaseTextField
                v-model="passwordValue"
                type="password"
                label="Пароль"
                placeholder="Введите пароль"
              />
            </div>
          </div>
        </div>

        <!-- Text Field Sizes -->
        <div class="mb-12">
          <h3 class="text-lg font-semibold text-gray-700 mb-4">Размеры полей</h3>
          <p class="text-sm text-gray-500 mb-4">Три размера: sm, md (default), lg</p>
          <div class="bg-white rounded-xl p-6 shadow-sm space-y-6">
            <BaseTextField
              v-model="sizeSmValue"
              label="Small (sm)"
              placeholder="Маленький размер"
              size="sm"
            />
            <BaseTextField
              v-model="sizeMdValue"
              label="Medium (md)"
              placeholder="Средний размер"
              size="md"
            />
            <BaseTextField
              v-model="sizeLgValue"
              label="Large (lg)"
              placeholder="Большой размер"
              size="lg"
            />
          </div>
        </div>

        <!-- Text Field with Icons -->
        <div class="mb-12">
          <h3 class="text-lg font-semibold text-gray-700 mb-4">Поля с иконками</h3>
          <p class="text-sm text-gray-500 mb-4">Иконки слева и справа</p>
          <div class="bg-white rounded-xl p-6 shadow-sm space-y-6">
            <div class="grid md:grid-cols-2 gap-6">
              <BaseTextField
                v-model="iconLeftValue"
                label="Иконка слева"
                placeholder="Поиск..."
                icon="mdi:magnify"
                icon-position="left"
              />
              <BaseTextField
                v-model="iconRightValue"
                label="Иконка справа"
                placeholder="Email"
                icon="mdi:email"
                icon-position="right"
              />
            </div>
          </div>
        </div>

        <!-- Text Field States -->
        <div class="mb-12">
          <h3 class="text-lg font-semibold text-gray-700 mb-4">Состояния полей</h3>
          <p class="text-sm text-gray-500 mb-4">Disabled, readonly, error, clearable</p>
          <div class="bg-white rounded-xl p-6 shadow-sm space-y-6">
            <div class="grid md:grid-cols-2 gap-6">
              <BaseTextField
                v-model="disabledValue"
                label="Disabled"
                placeholder="Недоступно"
                disabled
              />
              <BaseTextField
                v-model="readonlyValue"
                label="Readonly"
                readonly
              />
            </div>
            <div class="grid md:grid-cols-2 gap-6">
              <BaseTextField
                v-model="errorValue"
                label="С ошибкой"
                placeholder="Введите значение"
                error="Это поле обязательно для заполнения"
                required
              />
              <BaseTextField
                v-model="helperValue"
                label="С подсказкой"
                placeholder="Введите значение"
                helper-text="Это вспомогательный текст"
              />
            </div>
            <div class="grid md:grid-cols-2 gap-6">
              <BaseTextField
                v-model="clearableValue"
                label="Clearable"
                placeholder="Введите текст и очистите"
                clearable
              />
            </div>
          </div>
        </div>
      </section>

      <!-- SELECT SECTION -->
      <section class="mb-16">
        <h2 class="text-2xl font-bold text-secondary mb-8 pb-4 border-b border-gray-200">
          Выпадающие списки (BaseSelect)
        </h2>

        <!-- Basic Select -->
        <div class="mb-12">
          <h3 class="text-lg font-semibold text-gray-700 mb-4">Базовый Select</h3>
          <p class="text-sm text-gray-500 mb-4">Используется в: ApplicationModal, ListFilterPanel</p>
          <div class="bg-white rounded-xl p-6 shadow-sm space-y-6">
            <div class="grid md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-secondary mb-1.5 md:mb-2">
                  Выберите город
                </label>
                <BaseSelect v-model="selectValue">
                  <option value="">Выберите...</option>
                  <option value="istanbul">Стамбул</option>
                  <option value="ankara">Анкара</option>
                  <option value="izmir">Измир</option>
                  <option value="antalya">Анталья</option>
                </BaseSelect>
              </div>
              <div>
                <label class="block text-sm font-medium text-secondary mb-1.5 md:mb-2">
                  Disabled Select
                </label>
                <BaseSelect v-model="selectDisabledValue" disabled>
                  <option value="disabled">Недоступно</option>
                </BaseSelect>
              </div>
            </div>
            <div class="grid md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-secondary mb-1.5 md:mb-2">
                  Select с ошибкой
                </label>
                <BaseSelect v-model="selectErrorValue" error="Выберите значение">
                  <option value="">Выберите...</option>
                  <option value="option1">Опция 1</option>
                </BaseSelect>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CHECKBOX SECTION -->
      <section class="mb-16">
        <h2 class="text-2xl font-bold text-secondary mb-8 pb-4 border-b border-gray-200">
          Чекбоксы (BaseCheckbox)
        </h2>

        <!-- Basic Checkboxes -->
        <div class="mb-12">
          <h3 class="text-lg font-semibold text-gray-700 mb-4">Базовые чекбоксы</h3>
          <p class="text-sm text-gray-500 mb-4">Используется в: ApplicationModal, Filters</p>
          <div class="bg-white rounded-xl p-6 shadow-sm space-y-4">
            <BaseCheckbox v-model="checkbox1">
              Обычный чекбокс
            </BaseCheckbox>
            <BaseCheckbox v-model="checkbox2">
              Checked чекбокс
            </BaseCheckbox>
            <BaseCheckbox v-model="checkbox3" disabled>
              Disabled чекбокс
            </BaseCheckbox>
            <BaseCheckbox v-model="checkbox4">
              <span>
                Соглашаюсь с
                <a href="#" class="text-primary hover:underline">условиями использования</a>
              </span>
            </BaseCheckbox>
          </div>
        </div>
      </section>

      <!-- RANGE SLIDER SECTION -->
      <section class="mb-16">
        <h2 class="text-2xl font-bold text-secondary mb-8 pb-4 border-b border-gray-200">
          Range Slider (BaseRangeSlider)
        </h2>

        <!-- Basic Range Slider -->
        <div class="mb-12">
          <h3 class="text-lg font-semibold text-gray-700 mb-4">Базовый Range Slider</h3>
          <p class="text-sm text-gray-500 mb-4">Используется в: ListFilterPanel (фильтр цен)</p>
          <div class="bg-white rounded-xl p-6 shadow-sm space-y-6">
            <div class="max-w-md">
              <BaseRangeSlider
                v-model="rangeValue"
                :min="0"
                :max="50000"
                :step="1000"
                label="Цена за год"
              />
            </div>
            <div class="max-w-md">
              <BaseRangeSlider
                v-model="rangeValue2"
                :min="0"
                :max="100"
                :step="5"
                label="Процент"
                :formatter="(v) => `${v}%`"
              />
            </div>
          </div>
        </div>
      </section>

      <!-- TEXTAREA SECTION -->
      <section class="mb-16">
        <h2 class="text-2xl font-bold text-secondary mb-8 pb-4 border-b border-gray-200">
          Textarea
        </h2>

        <!-- Basic Textarea -->
        <div class="mb-12">
          <h3 class="text-lg font-semibold text-gray-700 mb-4">Базовый Textarea</h3>
          <p class="text-sm text-gray-500 mb-4">Используется в: ApplicationModal, ShareExperienceForm</p>
          <div class="bg-white rounded-xl p-6 shadow-sm space-y-6">
            <div>
              <label class="block text-sm font-medium text-secondary mb-1.5 md:mb-2">
                Сообщение
              </label>
              <textarea
                v-model="textareaValue"
                placeholder="Введите ваше сообщение..."
                rows="4"
                class="w-full px-3 md:px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-medium text-secondary placeholder-gray-400 min-h-touch-44"
              ></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-secondary mb-1.5 md:mb-2">
                Textarea с ошибкой
              </label>
              <textarea
                v-model="textareaErrorValue"
                placeholder="Введите текст..."
                rows="3"
                class="w-full px-3 md:px-4 py-3 bg-white border border-red-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 font-medium text-secondary placeholder-gray-400"
              ></textarea>
              <p class="mt-1.5 md:mt-2 text-sm text-red-600">Это поле обязательно</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-secondary mb-1.5 md:mb-2">
                Disabled Textarea
              </label>
              <textarea
                disabled
                placeholder="Недоступно"
                rows="3"
                class="w-full px-3 md:px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl opacity-50 cursor-not-allowed font-medium text-secondary placeholder-gray-400"
              ></textarea>
            </div>
          </div>
        </div>
      </section>

      <!-- NATIVE INPUTS SECTION -->
      <section class="mb-16">
        <h2 class="text-2xl font-bold text-secondary mb-8 pb-4 border-b border-gray-200">
          Нативные поля ввода
        </h2>

        <!-- Phone Input Styled -->
        <div class="mb-12">
          <h3 class="text-lg font-semibold text-gray-700 mb-4">Телефонные поля</h3>
          <p class="text-sm text-gray-500 mb-4">Используется в: ApplicationModal</p>
          <div class="bg-white rounded-xl p-6 shadow-sm space-y-6">
            <div class="grid md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-secondary mb-1.5 md:mb-2">
                  Телефон (стандартный)
                  <span class="text-red-500 ml-1">*</span>
                </label>
                <input
                  v-model="nativePhoneValue"
                  type="tel"
                  placeholder="+7 (999) 999-99-99"
                  inputmode="tel"
                  autocomplete="tel"
                  class="w-full px-3 md:px-4 py-3 md:py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-medium text-secondary placeholder-gray-400 text-sm md:text-sm min-h-touch-44 md:min-h-auto"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-secondary mb-1.5 md:mb-2">
                  Телефон (с ошибкой)
                </label>
                <input
                  type="tel"
                  placeholder="+7 (999) 999-99-99"
                  class="w-full px-3 md:px-4 py-3 md:py-3 bg-white border border-red-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 font-medium text-secondary placeholder-gray-400 text-sm md:text-sm min-h-touch-44 md:min-h-auto"
                />
                <p class="mt-1.5 md:mt-2 text-sm text-red-600 flex items-start gap-1">
                  <Icon name="mdi:alert-circle" class="w-4 h-4 mt-0.5 flex-shrink-0" />
                  Введите корректный номер телефона
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Number Inputs -->
        <div class="mb-12">
          <h3 class="text-lg font-semibold text-gray-700 mb-4">Числовые поля</h3>
          <p class="text-sm text-gray-500 mb-4">Используется в: TranslationsCalculatorSection</p>
          <div class="bg-white rounded-xl p-6 shadow-sm space-y-6">
            <div class="grid md:grid-cols-3 gap-6">
              <div>
                <label class="block text-sm font-medium text-secondary mb-1.5 md:mb-2">
                  Количество страниц
                </label>
                <input
                  v-model="numberValue"
                  type="number"
                  min="1"
                  max="1000"
                  placeholder="1"
                  class="w-full px-3 md:px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-medium text-secondary placeholder-gray-400 text-sm"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-secondary mb-1.5 md:mb-2">
                  Цена
                </label>
                <input
                  v-model="priceValue"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  class="w-full px-3 md:px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-medium text-secondary placeholder-gray-400 text-sm"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-secondary mb-1.5 md:mb-2">
                  Год
                </label>
                <input
                  v-model="yearValue"
                  type="number"
                  min="1900"
                  max="2030"
                  placeholder="2024"
                  class="w-full px-3 md:px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-medium text-secondary placeholder-gray-400 text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Search Input -->
        <div class="mb-12">
          <h3 class="text-lg font-semibold text-gray-700 mb-4">Поле поиска</h3>
          <p class="text-sm text-gray-500 mb-4">Используется в: FAQ, ListFilterPanel</p>
          <div class="bg-white rounded-xl p-6 shadow-sm space-y-6">
            <div class="max-w-lg relative">
              <input
                v-model="searchValue"
                type="search"
                placeholder="Поиск по вопросам..."
                class="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-medium text-secondary placeholder-gray-400 text-sm"
              />
              <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Icon name="mdi:magnify" class="w-5 h-5 text-gray-400" />
              </div>
            </div>
            <div class="max-w-lg relative">
              <input
                v-model="searchValue2"
                type="search"
                placeholder="Поиск университетов..."
                class="w-full pl-12 pr-4 py-4 bg-gray-100 border-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary font-medium text-secondary placeholder-gray-500 text-base"
              />
              <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <Icon name="mdi:magnify" class="w-6 h-6 text-gray-500" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- RADIO BUTTONS SECTION -->
      <section class="mb-16">
        <h2 class="text-2xl font-bold text-secondary mb-8 pb-4 border-b border-gray-200">
          Radio Buttons
        </h2>

        <!-- Basic Radio -->
        <div class="mb-12">
          <h3 class="text-lg font-semibold text-gray-700 mb-4">Базовые Radio кнопки</h3>
          <p class="text-sm text-gray-500 mb-4">Используется в: формах выбора</p>
          <div class="bg-white rounded-xl p-6 shadow-sm space-y-4">
            <div class="space-y-3">
              <label class="flex items-center cursor-pointer py-1 min-h-touch-24 md:min-h-auto">
                <input
                  v-model="radioValue"
                  type="radio"
                  name="degree"
                  value="bachelor"
                  class="w-5 h-5 md:w-4 md:h-4 text-primary bg-white border-gray-300 focus:ring-2 focus:ring-primary focus:ring-offset-0"
                />
                <span class="ml-3 text-sm font-medium text-secondary">Бакалавриат</span>
              </label>
              <label class="flex items-center cursor-pointer py-1 min-h-touch-24 md:min-h-auto">
                <input
                  v-model="radioValue"
                  type="radio"
                  name="degree"
                  value="master"
                  class="w-5 h-5 md:w-4 md:h-4 text-primary bg-white border-gray-300 focus:ring-2 focus:ring-primary focus:ring-offset-0"
                />
                <span class="ml-3 text-sm font-medium text-secondary">Магистратура</span>
              </label>
              <label class="flex items-center cursor-pointer py-1 min-h-touch-24 md:min-h-auto">
                <input
                  v-model="radioValue"
                  type="radio"
                  name="degree"
                  value="phd"
                  class="w-5 h-5 md:w-4 md:h-4 text-primary bg-white border-gray-300 focus:ring-2 focus:ring-primary focus:ring-offset-0"
                />
                <span class="ml-3 text-sm font-medium text-secondary">Докторантура</span>
              </label>
              <label class="flex items-center cursor-pointer py-1 min-h-touch-24 md:min-h-auto opacity-50">
                <input
                  type="radio"
                  name="degree"
                  value="disabled"
                  disabled
                  class="w-5 h-5 md:w-4 md:h-4 text-primary bg-white border-gray-300 cursor-not-allowed"
                />
                <span class="ml-3 text-sm font-medium text-gray-400">Disabled опция</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Card Radio -->
        <div class="mb-12">
          <h3 class="text-lg font-semibold text-gray-700 mb-4">Radio карточки</h3>
          <p class="text-sm text-gray-500 mb-4">Используется в: WhoSection (questionnaire)</p>
          <div class="bg-white rounded-xl p-6 shadow-sm">
            <div class="grid md:grid-cols-3 gap-4 max-w-3xl">
              <button
                :class="[
                  'p-4 border-2 rounded-xl transition-all text-left min-h-touch-44',
                  cardRadioValue === 'student' ? 'border-primary bg-red-50' : 'border-gray-200 hover:border-primary hover:bg-red-50',
                ]"
                @click="cardRadioValue = 'student'"
              >
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                    <Icon name="mdi:school" class="text-blue-500" />
                  </div>
                  <div>
                    <p class="font-semibold text-secondary">Студент</p>
                    <p class="text-xs text-gray-500">Ищу университет</p>
                  </div>
                </div>
              </button>
              <button
                :class="[
                  'p-4 border-2 rounded-xl transition-all text-left min-h-touch-44',
                  cardRadioValue === 'parent' ? 'border-primary bg-red-50' : 'border-gray-200 hover:border-primary hover:bg-red-50',
                ]"
                @click="cardRadioValue = 'parent'"
              >
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                    <Icon name="mdi:heart" class="text-purple-500" />
                  </div>
                  <div>
                    <p class="font-semibold text-secondary">Родитель</p>
                    <p class="text-xs text-gray-500">Помогаю ребенку</p>
                  </div>
                </div>
              </button>
              <button
                :class="[
                  'p-4 border-2 rounded-xl transition-all text-left min-h-touch-44',
                  cardRadioValue === 'agent' ? 'border-primary bg-red-50' : 'border-gray-200 hover:border-primary hover:bg-red-50',
                ]"
                @click="cardRadioValue = 'agent'"
              >
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                    <Icon name="mdi:briefcase" class="text-green-500" />
                  </div>
                  <div>
                    <p class="font-semibold text-secondary">Агент</p>
                    <p class="text-xs text-gray-500">Представляю клиента</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- FORM EXAMPLES SECTION -->
      <section class="mb-16">
        <h2 class="text-2xl font-bold text-secondary mb-8 pb-4 border-b border-gray-200">
          Примеры форм
        </h2>

        <!-- Contact Form -->
        <div class="mb-12">
          <h3 class="text-lg font-semibold text-gray-700 mb-4">Форма заявки</h3>
          <p class="text-sm text-gray-500 mb-4">Как в: ApplicationModal</p>
          <div class="bg-white rounded-xl p-6 shadow-sm max-w-lg">
            <form class="space-y-5" @submit.prevent>
              <BaseTextField
                v-model="formName"
                label="Имя"
                placeholder="Введите ваше имя"
                required
              />
              <BaseTextField
                v-model="formPhone"
                type="tel"
                label="Телефон"
                placeholder="+7 (999) 999-99-99"
                required
              />
              <BaseTextField
                v-model="formEmail"
                type="email"
                label="Email"
                placeholder="example@mail.com"
              />
              <div>
                <label class="block text-sm font-medium text-secondary mb-1.5 md:mb-2">
                  Город
                </label>
                <BaseSelect v-model="formCity">
                  <option value="">Выберите город...</option>
                  <option value="istanbul">Стамбул</option>
                  <option value="ankara">Анкара</option>
                  <option value="izmir">Измир</option>
                </BaseSelect>
              </div>
              <div>
                <label class="block text-sm font-medium text-secondary mb-1.5 md:mb-2">
                  Сообщение
                </label>
                <textarea
                  v-model="formMessage"
                  placeholder="Ваше сообщение..."
                  rows="4"
                  class="w-full px-3 md:px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-medium text-secondary placeholder-gray-400"
                ></textarea>
              </div>
              <BaseCheckbox v-model="formAgreement">
                <span>
                  Соглашаюсь с
                  <a href="#" class="text-primary hover:underline">политикой конфиденциальности</a>
                </span>
              </BaseCheckbox>
              <button
                type="submit"
                class="w-full bg-primary text-white rounded-xl font-semibold hover:bg-red-600 active:bg-red-700 transition-colors py-4 text-lg shadow-lg"
              >
                Отправить заявку
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
// BaseTextField values
const textFieldValue = ref('')
const emailValue = ref('')
const phoneValue = ref('')
const passwordValue = ref('')

// Sizes
const sizeSmValue = ref('')
const sizeMdValue = ref('')
const sizeLgValue = ref('')

// Icons
const iconLeftValue = ref('')
const iconRightValue = ref('')

// States
const disabledValue = ref('Disabled value')
const readonlyValue = ref('Readonly value')
const errorValue = ref('')
const helperValue = ref('')
const clearableValue = ref('Очистите это поле')

// Select values
const selectValue = ref('')
const selectDisabledValue = ref('disabled')
const selectErrorValue = ref('')

// Checkbox values
const checkbox1 = ref(false)
const checkbox2 = ref(true)
const checkbox3 = ref(false)
const checkbox4 = ref(false)

// Range slider values
const rangeValue = ref<[number, number]>([5000, 25000])
const rangeValue2 = ref<[number, number]>([20, 80])

// Textarea values
const textareaValue = ref('')
const textareaErrorValue = ref('')

// Native inputs
const nativePhoneValue = ref('')
const numberValue = ref(1)
const priceValue = ref(0)
const yearValue = ref(2024)
const searchValue = ref('')
const searchValue2 = ref('')

// Radio values
const radioValue = ref('bachelor')
const cardRadioValue = ref('student')

// Form values
const formName = ref('')
const formPhone = ref('')
const formEmail = ref('')
const formCity = ref('')
const formMessage = ref('')
const formAgreement = ref(false)
</script>
