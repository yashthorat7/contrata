import { useHomeTimeline } from '../hooks/useHomeTimeline';
import { Timeline, TimelineItem } from '../components/ui/Timeline';
import homeData from '../data/homeTimeline.json';

export default function Home() {
  const steps = useHomeTimeline();

  return (
    <main className="mx-auto max-w-4xl py-10 font-sans antialiased">
      <div className="mb-16 flex flex-col gap-2">
        <h1 className="font-serif text-4xl leading-tight font-normal text-neutral-900">{homeData.hero.title}</h1>
        <p className="text-sm text-neutral-500">{homeData.hero.description}</p>
      </div>

      <Timeline>
        {steps.map((step, index) => (
          <TimelineItem
            key={index}
            variant={step.isNote ? 'dot' : 'number'}
            indicator={step.num}
            title={step.title}
            description={step.desc}
            headerRight={step.headerRight ? step.headerRight() : null}
            isLast={index === steps.length - 1}
            bulletPt={step.bulletPt}>
            {step.renderContent && step.renderContent()}
          </TimelineItem>
        ))}
      </Timeline>
    </main>
  );
}
