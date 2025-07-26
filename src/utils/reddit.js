export function extractUsername(input) {
  if (!input) return ''
  
  const regex = /reddit\.com\/(?:user|u)\/([a-zA-Z0-9_-]+)/i
  const match = input.match(regex)
  return match ? match[1] : input
}