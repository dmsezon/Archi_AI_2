import React, { useState } from 'react';

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

const Accordion: React.FC<AccordionProps> = ({ title, children, icon }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="bg-gray-700/50 rounded-lg border border-gray-600">
      <h2>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full p-3 font-medium text-left text-gray-200 hover:bg-gray-700"
          aria-expanded={isOpen}
        >
          <div className="flex items-center gap-3">
            {icon && <span className="text-gray-400">{icon}</span>}
            <span>{title}</span>
          </div>
          <svg className={`w-3 h-3 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5 5 1 1 5"/>
          </svg>
        </button>
      </h2>
      <div className={`${isOpen ? 'block' : 'hidden'}`}>
        <div className="border-t border-gray-600">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Accordion;
