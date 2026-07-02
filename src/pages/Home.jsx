import React from 'react';
import { Timeline, TimelineItem } from '../components/ui/Timeline';
import { Tabs } from '../components/ui/Tabs';
import ContextStep from '../components/home/ContextStep';
import PreferencesStep from '../components/home/PreferencesStep';
import ResponseStep from '../components/home/ResponseStep';
import NextSteps from '../components/home/NextSteps';
import timelineData from '../data/homeTimeline.json';
import { useHomeTimeline } from '../hooks/useHomeTimeline.js';

export default function Home() {
  const { prefTab, setPrefTab } = useHomeTimeline();

  const steps = [
    {
      ...timelineData.steps[0],
      renderContent: () => <ContextStep />
    },
    {
      ...timelineData.steps[1],
      headerRight: () => (
        <Tabs
          tabs={[
            { id: 'search', label: 'Search' },
            { id: 'add', label: 'Add' }
          ]}
          activeId={prefTab}
          onChange={setPrefTab}
        />
      ),
      renderContent: () => <PreferencesStep activeTab={prefTab} />
    },
    {
      ...timelineData.steps[2],
      desc: (
        <>
          {timelineData.steps[2].desc.split('Apify')[0]}
          <a
            href={timelineData.steps[2].descLinks[0].url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-neutral-600 underline underline-offset-2 transition-colors hover:text-neutral-800">
            {timelineData.steps[2].descLinks[0].text}
          </a>
          {timelineData.steps[2].desc.split('Apify')[1]}
        </>
      ),
      renderContent: () => <ResponseStep />
    },
    {
      ...timelineData.steps[3],
      renderContent: () => <NextSteps />
    }
  ];

  const notes = timelineData.notes.map(note => ({
    isNote: true,
    bulletPt: note.bulletPt,
    renderContent: () => {
      if (note.descLinks) {
        return (
          <p className="mt-[1px] font-sans text-sm text-neutral-600">
            {note.text.split(note.descLinks[0].text)[0]}
            <a
              href={note.descLinks[0].url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-neutral-800 transition-colors hover:text-neutral-600">
              <span className="underline underline-offset-2">{note.descLinks[0].text}</span>
            </a>
            {note.text.split(note.descLinks[0].text)[1]}
          </p>
        );
      }
      return <p className="mt-[1px] font-sans text-sm text-neutral-600">{note.text}</p>;
    }
  }));

  const allSteps = [...steps, ...notes];

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 font-sans antialiased lg:px-0">
      <div className="mb-16 flex flex-col gap-2">
        <h1 className="font-serif text-4xl leading-tight font-normal text-neutral-900">{timelineData.hero.title}</h1>
        <p className="text-sm text-neutral-500">{timelineData.hero.description}</p>
      </div>

      <Timeline>
        {allSteps.map((step, index) => (
          <TimelineItem
            key={index}
            variant={step.isNote ? 'dot' : 'number'}
            indicator={step.num}
            title={step.title}
            description={step.desc}
            headerRight={step.headerRight ? step.headerRight() : null}
            isLast={index === allSteps.length - 1}
            bulletPt={step.bulletPt}>
            {step.renderContent && step.renderContent()}
          </TimelineItem>
        ))}
      </Timeline>
    </main>
  );
}
