<script setup lang="ts">
const route = useRoute()
const slug = computed(() => route.params.slug as string)

const { data: role } = await useAsyncData(`career-${slug.value}`, () =>
  queryCollection('careers').where('stem', '=', `en/careers/${slug.value}`).first(),
)
if (!role.value) throw createError({ statusCode: 404, fatal: true })

useSeoMeta({
  title: () => `${role.value?.title} — qtvue Careers`,
  description: () => role.value?.summary ?? '',
})
</script>

<template>
  <article v-if="role">
    <Section eyebrow="Careers" :heading="role.title" level="1">
      <p class="text-text-secondary">{{ role.location }} · {{ role.type }}</p>
      <ContentRenderer :value="role" class="prose mt-8 max-w-none" />
      <div class="mt-8">
        <Btn href="mailto:hello@qtvue.com" size="lg">Apply</Btn>
      </div>
    </Section>
  </article>
</template>
