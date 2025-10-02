import React from 'react';
import programs from '../../data/programs.json'
import ProgramCard from '../ProgramCard';
import './styles.css';

export default function ProgramList() {
  const themes = ['green', 'sand', 'sage', 'blue'];

  return (
    <section className="programs">
      <div className="programs__grid">
        {programs.map((p, i) => (
          <ProgramCard
            key={p.id || p.name || i}
            title={p.name}
            subtitle={p.subtitle}
            description={p.description}
            imgSrc={p.image}
            imgAlt={p.name}
            theme={themes[i % themes.length]}
          />
        ))}
      </div>
    </section>
  );
}