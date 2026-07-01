import React, { useState } from 'react';
import ContextStep from '../components/home/ContextStep';
import PreferencesStep from '../components/home/PreferencesStep';
import ResponseStep from '../components/home/ResponseStep';
import NextSteps from '../components/home/NextSteps';
import { Tabs } from '../components/ui/Tabs';
import timelineData from '../data/homeTimeline.json';

export function useHomeTimeline() {
  const [prefTab, setPrefTab] = useState('search');

  // map json to components
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

  return [...steps, ...notes];
}
