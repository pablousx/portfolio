import parse from 'html-react-parser'
import {
  createElement,
  type ElementType,
  type HTMLAttributes,
  type ReactNode
} from 'react'

interface RichTextProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType
  children: ReactNode
}

export default function RichText({
  children,
  as: Tag,
  className,
  ...props
}: RichTextProps) {
  const childrenElement = parse(
    Array.isArray(children) ? children.join('') : String(children)
  )

  return Tag
    ? createElement(Tag, { className, ...props }, childrenElement)
    : childrenElement
}
