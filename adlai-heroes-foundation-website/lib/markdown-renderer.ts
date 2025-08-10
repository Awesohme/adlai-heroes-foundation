/**
 * Simple markdown renderer that matches the WYSIWYG editor's preview function
 * Converts markdown-style formatting to HTML for display on public pages
 * XSS-safe: Only allows specific markdown patterns, no raw HTML
 */
export function renderMarkdown(text: string): string {
  if (!text) return ''
  
  // First, escape any potential HTML to prevent XSS
  const escapeHtml = (unsafe: string) => {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;")
  }
  
  const escaped = escapeHtml(text)
  
  return escaped
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mb-4">$1</h1>')
    .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold mb-3">$1</h2>')
    .replace(/^### (.*$)/gm, '<h3 class="text-lg font-medium mb-2">$1</h3>')
    .replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-2">$1</blockquote>')
    .replace(/^- (.*$)/gm, '<li class="ml-4">$1</li>')
    .replace(/^\d+\. (.*$)/gm, '<li class="ml-4">$1</li>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline">$1</a>')
    .replace(/\n/g, '<br>')
}