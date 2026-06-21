// Vitest global setup: register all ui/ primitives as global components so
// tests of composite components (e.g. Section using Container) resolve them
// without each test having to stub them.
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
}
