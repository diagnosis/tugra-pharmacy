import { createFileRoute } from '@tanstack/react-router'
import {Hero} from "@/components/app/Hero.tsx";

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
      <>
        <Hero/>
      </>
  )
}
