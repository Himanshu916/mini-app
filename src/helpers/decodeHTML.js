export const decodeHTML = (html) => {
  if (!html) return ""
  const doc = new DOMParser().parseFromString(html, "text/html")
  return doc.documentElement.textContent || ""
}

export const isHtmlContent = (str) => /<\/?[a-z][\s\S]*>/i.test(str)

export const cleanHTML = (html) => {
  if (!html) return ""

  // Fix common issues
  let cleaned = html

  // Ensure all <a> tags have absolute URLs
  cleaned = cleaned.replace(/href="(www\.[^"]+)"/gi, 'href="https://$1"')

  // Remove class, style, and other unwanted attributes
  cleaned = cleaned.replace(/\s(class|style|id|onclick)="[^"]*"/gi, "")

  // Close <br> tags if not closed
  cleaned = cleaned.replace(/<br[^>]*>/gi, "<br />")

  // Remove empty tags (e.g., <p></p>)
  cleaned = cleaned.replace(/<p>\s*<\/p>/gi, "")

  // Optional: allow only certain tags
  const allowedTags = [
    "p",
    "a",
    "br",
    "div",
    "span",
    "strong",
    "em",
    "ul",
    "ol",
    "li",
  ]
  const tagRegex = /<\/?([a-z0-9]+)(?: [^>]*?)?>/gi
  cleaned = cleaned.replace(tagRegex, (match, tag) =>
    allowedTags.includes(tag.toLowerCase()) ? match : ""
  )

  return cleaned
}

const stripHtmlTags = (html) => {
  return html.replace(/<[^>]*>/g, "") // removes all tags
}

export const truncateToNChars = (html, limit = 150) => {
  const cleanText = stripHtmlTags(html)
  console.log("cleanText", html, "what is happening", cleanText, "limit", limit)
  const truncated = cleanText.slice(0, limit)
  const showEllipsis = cleanText.length > limit

  return {
    truncatedHTML: `<p>${truncated}${showEllipsis ? "..." : ""}</p>`,
    showEllipsis,
  }
}
