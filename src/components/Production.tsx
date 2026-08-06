import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'

export default function Production() {
  if (process.env.NODE_ENV !== 'production') return null

  return (
    <>
      <Analytics debug={false} />
      <SpeedInsights debug={false} />
    </>
  )
}
