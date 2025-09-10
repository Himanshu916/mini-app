import React, { useMemo } from "react"
import {
  cleanHTML,
  decodeHTML,
  isHtmlContent,
  truncateToNChars,
} from "../helpers/decodeHTML"

export const BountyDescription = ({ html, className = "" }) => {
  const isHTML = isHtmlContent(decodeHTML(html))
  const htmlString = isHTML ? decodeHTML(html) : html

  const { truncatedHTML } = useMemo(() => {
    if (isHTML && htmlString) {
      return truncateToNChars(cleanHTML(htmlString), 300)
    }
    return { truncatedHTML: "", showEllipsis: false }
  }, [htmlString, isHTML])
  return isHTML ? (
    <div
      className={`desc-html ${className} prose prose-a:text-blue-600 prose-a:underline`}
      dangerouslySetInnerHTML={{ __html: truncatedHTML }}
    />
  ) : (
    <p className={className}>{htmlString}</p>
  )
}

export const BountyDescriptionDetail = ({ html, className = "" }) => {
  const isHTML = isHtmlContent(decodeHTML(html))
  const htmlString = isHTML ? decodeHTML(html) : html
  return isHTML ? (
    <div
      className="prose desc-html  text-textSupportHeading max-w-none [&_p:empty]:before:content-['\00a0'] [&_p:empty]:inline-block"
      dangerouslySetInnerHTML={{ __html: htmlString }}
    />
  ) : (
    <p className={className}>{htmlString}</p>
  )
}
