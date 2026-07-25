import { permanentRedirect } from 'next/navigation'

export default async function NotFound() {
  permanentRedirect('/')
}
