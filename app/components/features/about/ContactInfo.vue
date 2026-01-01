<template>
  <BaseSection id="contacts" padding="lg" max-width="6xl">
        <BaseSectionHeader
          :title="t(contactNs('title'))"
          :subtitle="t(contactNs('subtitle'))"
          align="center"
          max-width="full"
        />

        <div class="grid lg:grid-cols-3 gap-component-lg mb-component-lg">
          <BaseCard padding="xl" shadow="md" rounded="2xl" hover="lift" class="text-center">
            <BaseIconBox
              icon="mdi:whatsapp"
              color="success"
              size="lg"
              class="mx-auto mb-component-md"
            />
            <h3 class="text-card-title mb-component-sm">WhatsApp</h3>
            <p class="text-body-sm mb-component-sm">
              {{ t(channelsNs('whatsapp.description')) }}
            </p>
            <BaseButton
              variant="whatsapp-cta"
              size="md"
              @click="handleSocialClick(channels.whatsapp.href)"
            >
              {{ t(channelsNs('whatsapp.button')) }}
            </BaseButton>
          </BaseCard>

          <BaseCard padding="xl" shadow="md" rounded="2xl" hover="lift" class="text-center">
            <BaseIconBox
              icon="mdi:telegram"
              color="info"
              size="lg"
              class="mx-auto mb-component-md"
            />
            <h3 class="text-card-title mb-component-sm">Telegram</h3>
            <p class="text-body-sm mb-component-sm">
              {{ t(channelsNs('telegram.description')) }}
            </p>
            <BaseButton
              variant="primary"
              size="md"
              @click="handleSocialClick(channels.telegram.href)"
            >
              {{ t(channelsNs('telegram.button')) }}
            </BaseButton>
          </BaseCard>

          <BaseCard padding="xl" shadow="md" rounded="2xl" hover="lift" class="text-center">
            <BaseIconBox
              icon="mdi:email"
              color="primary"
              size="lg"
              class="mx-auto mb-component-md"
            />
            <h3 class="text-card-title mb-component-sm">Email</h3>
            <p class="text-body-sm mb-component-sm">info@edu-turkish.com</p>
            <BaseButton
              variant="primary"
              size="md"
              href="mailto:info@edu-turkish.com"
            >
              {{ t(channelsNs('email.button')) }}
            </BaseButton>
          </BaseCard>
        </div>
  </BaseSection>
</template>

<script setup lang="ts">
import { useContactChannels } from '~/composables/useContactChannels'
import { useFingerprint } from '~/composables/useFingerprint'
import { namespace } from '~~/lib/i18n'

const contactNs = namespace('about.contact')
const channelsNs = namespace('about.contact.channels')
const { t } = useI18n()
const { channels } = useContactChannels()

const { openWithFingerprint } = useFingerprint()

const handleSocialClick = (href: string) => openWithFingerprint(href, '_blank')
</script>
