// DailyCheckin.tsx

import { useState } from 'react';
import { X, ArrowRight, Loader, Sparkles } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface DailyCheckinProps {
  onClose: () => void;
  onComplete: () => void;
}

type Step = {
  id: string;
  question: string;
  subtext: string;
  options: { value: string; label: string; icon?: string }[];
  multi?: boolean;
};

const STEPS: Step[] = [
  {
    id: 'priority',
    question: 'What matters most today?',
    subtext: 'Choose everything that feels true right now.',
    multi: true,
    options: [
      { value: 'career', label: 'Career' },
      { value: 'health', label: 'Health' },
      { value: 'peace', label: 'Peace' },
      { value: 'growth', label: 'Growth' },
      { value: 'relationships', label: 'Relationships' },
      { value: 'creativity', label: 'Creativity' },
      { value: 'finances', label: 'Finances' },
      { value: 'family', label: 'Family' },
    ],
  },
  {
    id: 'energy',
    question: 'How is your energy right now?',
    subtext: 'Be honest — this helps Kymi plan your day better.',
    options: [
      { value: 'low', label: 'Low', icon: '🔋' },
      { value: 'medium', label: 'Medium', icon: '⚡' },
      { value: 'high', label: 'High', icon: '🔥' },
    ],
  },
];

export default function DailyCheckin({
  onClose,
  onComplete,
}: DailyCheckinProps) {

  const { user } = useAuth();

  const [step, setStep] = useState(0);

  const [answers, setAnswers] = useState<
    Record<string, string | string[]>
  >({});

  const [loading, setLoading] = useState(false);

  const currentStep = STEPS[step];

  const isMulti = !!currentStep.multi;

  const selected: string[] = isMulti
    ? (answers[currentStep.id] as string[]) || []
    : answers[currentStep.id]
    ? [answers[currentStep.id] as string]
    : [];

  const toggle = (value: string) => {

    if (isMulti) {

      const arr =
        (answers[currentStep.id] as string[]) || [];

      setAnswers({

        ...answers,

        [currentStep.id]: arr.includes(value)

          ? arr.filter((v) => v !== value)

          : [...arr, value],

      });

    } else {

      setAnswers({

        ...answers,

        [currentStep.id]: value,

      });

    }

  };

  const canAdvance = selected.length > 0;

  const next = () => {

    if (step < STEPS.length - 1)

      setStep(step + 1);

    else onComplete();

  };

  return (

    <div className="fixed inset-0 flex items-center justify-center z-50">

      <div

        className="absolute inset-0 bg-black/30"

        onClick={onClose}

      />

      <div

        className="relative w-full max-w-lg rounded-3xl shadow-xl"

        style={{
          maxHeight: '95vh',
          background: '#F7F4D5',
          opacity: 1
        }}

      >

        {/* HEADER */}

        <div className="flex justify-between items-center px-6 py-4">

          <span

            style={{

              color: "#24302B",

              fontWeight: 600,

            }}

          >

            Daily check-in

          </span>

          <button onClick={onClose}>

            <X size={18} />

          </button>

        </div>

        {/* QUESTION */}

        <div className="px-6">

          <h2

            className="font-heading text-2xl font-semibold mb-2 !text-[#24302B]"

            style={{

              fontSize: "22px",

              fontWeight: 600,

            }}

          >

            {currentStep.question}

          </h2>

          <p

            style={{

              color: "#24302B",

              opacity: 0.7,

              marginTop: 4,

            }}

          >

            {currentStep.subtext}

          </p>

        </div>

        {/* OPTIONS */}

        <div className="grid grid-cols-2 gap-3 p-6">

          {currentStep.options.map((opt) => {

            const isSelected =
              selected.includes(opt.value);

            return (

              <button

                key={opt.value}

                onClick={() => toggle(opt.value)}

                style={{

                  background: isSelected ? '#839958' : '#F7F4D5',

                  borderColor: isSelected ? '#839958' : 'rgba(131,153,88,0.20)',

                  border: "2px solid",

                  padding: "14px",

                  borderRadius: "16px",

                  color: isSelected ? '#FFFFFF' : '#1F2937'

                }}

              >

                <span

                  style={{

                    color: isSelected ? '#FFFFFF' : '#1F2937',

                    fontWeight: '600',

                    WebkitTextFillColor: isSelected ? '#FFFFFF' : '#1F2937'

                  }}

                >

                  {opt.label}

                </span>

              </button>

            );

          })}

        </div>

        {/* CONTINUE */}

        <div className="p-6">

          <button

            onClick={next}

            disabled={!canAdvance}

            style={{

              width: "100%",

              background: "#D3968C",

              color: "#FFFFFF",

              padding: "14px",

              borderRadius: "14px",

              fontWeight: 600,

            }}

          >

            Continue →

          </button>

        </div>

      </div>

    </div>

  );

}