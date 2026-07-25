declare module '*.module.css' {
  const classes: Readonly<Record<string, string>>
  export default classes
}

declare module '*.css'

declare module '*.svg' {
  import type { FunctionComponent, SVGProps } from 'react'

  const SvgComponent: FunctionComponent<SVGProps<SVGSVGElement> & { title?: string }>

  export default SvgComponent
}
