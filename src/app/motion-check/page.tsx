import { Probe } from "./probe";
import { DotField } from "@/components/motion-ui/dot-field";
import { Odometer } from "@/components/motion-ui/odometer";
import { VariableProximity } from "@/components/motion-ui/variable-proximity";

export default function MotionCheck() {
  return (
    <main className="flex flex-col">
      <Probe />
      <section className="relative isolate overflow-hidden border-b px-8 py-28">
        <DotField />
        <div className="relative mx-auto max-w-4xl">
          <p className="text-system mb-6">Dark theme</p>
          <VariableProximity as="h1" className="text-5xl">
            Every system, one interface
          </VariableProximity>
          <div className="mt-12 flex gap-16 font-display text-6xl font-bold">
            <Odometer value={1250} suffix="+" />
            <Odometer value={98} suffix="%" />
            <Odometer value={17} />
          </div>
        </div>
      </section>

      <section className="theme-light relative isolate overflow-hidden px-8 py-28">
        <DotField />
        <div className="relative mx-auto max-w-4xl">
          <p className="text-system mb-6">Light theme scope</p>
          <VariableProximity as="h2" className="text-5xl">
            Every system, one interface
          </VariableProximity>
          <div className="mt-12 flex gap-16 font-display text-6xl font-bold">
            <Odometer value={1250} suffix="+" />
            <Odometer value={98} suffix="%" />
            <Odometer value={17} />
          </div>
        </div>
      </section>
    </main>
  );
}
