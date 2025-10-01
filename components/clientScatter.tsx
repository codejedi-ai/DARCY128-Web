'use client'
import dynamic from 'next/dynamic'

const ScatterChartComponent = dynamic(() => import('./scatter'), {
  ssr: false
})

export default function ClientScatter() {
  return <ScatterChartComponent />
}