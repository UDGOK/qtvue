// Convert a content stem (e.g. 'en/services/integration') into the public
// route (e.g. '/services/integration') by stripping the locale prefix.
// English is the default locale (prefix_except_default strategy), so the
// route has no /en/ segment even though the content stem does.
export function stemToRoute(stem: string, localePrefix = 'en/'): string {
  const stripped = stem.startsWith(localePrefix) ? stem.slice(localePrefix.length) : stem
  return '/' + stripped
}
