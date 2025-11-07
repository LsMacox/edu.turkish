export function sanitizeRichText(input: string): string {
  if (!input) return ''
  let out = input.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
  out = out.replace(/\son[a-z]+\s*=\s*(["']).*?\1/gi, '')
  out = out.replace(/\s(href|src)\s*=\s*(["'])\s*javascript:[^"']*\2/gi, ' $1="#"')
  return out
}
