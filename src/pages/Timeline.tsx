import { useState, useEffect } from 'react';
import { Clock, Plus, X } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';

interface TimeSlot {
  time: string;
  hour: number;
  task?: string;
}

export default function Timeline() {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [taskInput, setTaskInput] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    generateTimeline();
    checkReminders();
    const interval = setInterval(checkReminders, 60000);
    return () => clearInterval(interval);
  }, []);

  const generateTimeline = () => {
    const slots: TimeSlot[] = [];
    for (let i = 6; i <= 23; i++) {
      const hour = i <= 12 ? i : i - 12;
      const ampm = i < 12 ? 'AM' : 'PM';
      const time = `${i}:00 ${ampm}`;
      const taskKey = `trykymi_task_${time}`;
      const savedTask = localStorage.getItem(taskKey);

      slots.push({
        time,
        hour: i,
        task: savedTask || undefined,
      });
    }
    setTimeSlots(slots);
  };

  const openModal = (time: string) => {
    setSelectedTime(time);
    const taskKey = `trykymi_task_${time}`;
    const savedTask = localStorage.getItem(taskKey);
    setTaskInput(savedTask || '');
    setIsModalOpen(true);
  };

  const saveTask = () => {
    if (selectedTime && taskInput.trim()) {
      const taskKey = `trykymi_task_${selectedTime}`;
      localStorage.setItem(taskKey, taskInput);
      generateTimeline();
      setIsModalOpen(false);
      setTaskInput('');
      setSelectedTime(null);
    }
  };

  const deleteTask = (time: string) => {
    const taskKey = `trykymi_task_${time}`;
    localStorage.removeItem(taskKey);
    generateTimeline();
  };

  const checkReminders = () => {
    const now = new Date();
    const hour = now.getHours();
    const ampm = hour < 12 ? 'AM' : 'PM';
    const display = hour <= 12 ? hour : hour - 12;
    const time = `${hour}:00 ${ampm}`;
    const taskKey = `trykymi_task_${time}`;
    const task = localStorage.getItem(taskKey);

    if (task) {
      const notification = new Notification('TryKymi Reminder', {
        body: task,
        icon: '⏰',
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      saveTask();
    }
  };

  return (
    <AppLayout>
      <main className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="text-green-400" size={32} />
            <h1 className="text-4xl font-bold text-white">Today's Timeline</h1>
          </div>
          <p className="text-gray-400">Plan your day hour by hour</p>
        </div>

        <div className="space-y-2">
          {timeSlots.map((slot) => (
            <div
              key={slot.time}
              className="group p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-green-500/30 hover:bg-slate-800/80 transition-all duration-300 cursor-pointer"
              onClick={() => openModal(slot.time)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-sm font-semibold text-green-400 min-w-20">{slot.time}</div>
                  {slot.task && (
                    <span className="px-3 py-1 bg-amber-600/40 border border-amber-500/30 text-amber-100 rounded-lg text-sm font-medium">
                      {slot.task}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {slot.task && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteTask(slot.time);
                      }}
                      className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-300 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  )}
                  <Plus size={18} className="text-gray-400" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {isModalOpen && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setIsModalOpen(false)}
          >
            <div
              className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-96 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">
                  Task at {selectedTime}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <X size={20} className="text-gray-400" />
                </button>
              </div>

              <input
                type="text"
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter your task..."
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:border-green-500/50 focus:outline-none mb-4"
                autoFocus
              />

              <div className="flex gap-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveTask}
                  className="flex-1 px-4 py-2 bg-green-600/40 hover:bg-green-600/60 border border-green-500/50 text-green-100 rounded-lg transition-all font-medium"
                >
                  Save Task
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </AppLayout>
  );
}
