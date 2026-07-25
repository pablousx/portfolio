declare module 'react-toggle-dark-mode' {
  import type { ButtonHTMLAttributes, CSSProperties, FunctionComponent } from 'react'

  interface DarkModeSwitchProps extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    'children' | 'onChange'
  > {
    checked: boolean
    moonColor?: string
    onChange: (checked: boolean) => void
    size?: number | string
    style?: CSSProperties
    sunColor?: string
  }

  export const DarkModeSwitch: FunctionComponent<DarkModeSwitchProps>
}
