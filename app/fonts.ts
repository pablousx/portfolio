import { Outfit, Poppins } from 'next/font/google'

export const titleFont = Poppins({
  display: 'swap',
  style: ['italic', 'normal'],
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  variable: '--title-font'
})

export const bodyFont = Outfit({
  display: 'swap',
  style: 'normal',
  weight: ['400', '600', '900'],
  subsets: ['latin'],
  variable: '--body-font'
})
