import parse from 'html-react-parser'

export default function RichText({ children, as: Tag, className, ...props }) {
  const childrenElement = parse(
    Array.isArray(children) ? children.join('') : String(children)
  )

  return Tag ? (
    <Tag className={className} {...props}>
      {childrenElement}
    </Tag>
  ) : (
    childrenElement
  )
}
