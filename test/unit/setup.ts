// Vitest global setup: register all ui/, layout/, and marketing/ components
// as globals so tests of composite components resolve them without per-test stubs.
// Also provide a NuxtLink stub that renders a real <a href="..."> with slot text,
// so href-based selectors and text assertions work as in the browser.
import { defineComponent, h } from 'vue'
import { config } from '@vue/test-utils'

import Badge from '~/components/ui/Badge.vue'
import Btn from '~/components/ui/Btn.vue'
import Card from '~/components/ui/Card.vue'
import Container from '~/components/ui/Container.vue'
import Icon from '~/components/ui/Icon.vue'
import Input from '~/components/ui/Input.vue'
import Media from '~/components/ui/Media.vue'
import Section from '~/components/ui/Section.vue'
import Select from '~/components/ui/Select.vue'
import Stat from '~/components/ui/Stat.vue'
import Textarea from '~/components/ui/Textarea.vue'
import Logo from '~/components/marketing/Logo.vue'
import ThemeToggle from '~/components/layout/ThemeToggle.vue'
import LanguageSwitcher from '~/components/layout/LanguageSwitcher.vue'

// NuxtLink stub: render <a :href="to"> with slot content.
const NuxtLinkStub = defineComponent({
  name: 'NuxtLink',
  props: { to: { type: String, default: '' } },
  setup(props, { slots }) {
    return () => h('a', { href: props.to }, slots.default?.())
  },
})

config.global.components = {
  Badge,
  Btn,
  Card,
  Container,
  Icon,
  Input,
  Media,
  Section,
  Select,
  Stat,
  Textarea,
  Logo,
  ThemeToggle,
  LanguageSwitcher,
  NuxtLink: NuxtLinkStub,
}
