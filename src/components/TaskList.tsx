import React, { useState } from 'react';
import { CheckSquare, Plus, Trash2, Check } from 'lucide-react';
import type { Task } from '../types';

interface TaskListProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, setTasks }) => {
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('General');
  const [estimatedPomos] = useState(2);
  const [filterCategory, setFilterCategory] = useState('all');

  const categories = ['General', 'Computer Science', 'Biology', 'History', 'Quiz Prep'];

  const filteredTasks = tasks.filter((t) =>
    filterCategory === 'all' ? true : t.category === filterCategory
  );

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      completed: false,
      estimatedPomodoros: estimatedPomos,
      completedPomodoros: 0,
      createdAt: new Date().toISOString()
    };

    setTasks((prev) => [newTask, ...prev]);
    setNewTitle('');
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      {/* Header & Add Task Form */}
      <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-indigo-400" />
            <h2 className="font-extrabold text-slate-100 text-base">Study Objectives & Tasks</h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {tasks.filter((t) => t.completed).length} / {tasks.length} Completed
          </span>
        </div>

        <form onSubmit={handleAddTask} className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
          <input
            type="text"
            placeholder="What do you want to learn or accomplish today?"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="sm:col-span-6 bg-slate-950 text-slate-100 border border-white/10 rounded-2xl px-4 py-2.5 text-xs focus:outline-none focus:border-indigo-500"
          />

          <select
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="sm:col-span-3 bg-slate-950 text-slate-100 border border-white/10 rounded-2xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <button
            type="submit"
            disabled={!newTitle.trim()}
            className="sm:col-span-3 py-2.5 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs shadow-md shadow-indigo-600/20 disabled:opacity-40 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Task
          </button>
        </form>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar px-1">
        <button
          onClick={() => setFilterCategory('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
            filterCategory === 'all'
              ? 'bg-indigo-600/30 border-indigo-500/50 text-indigo-200'
              : 'bg-slate-900 border-white/10 text-slate-400 hover:text-slate-200'
          }`}
        >
          All Categories
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              filterCategory === cat
                ? 'bg-indigo-600/30 border-indigo-500/50 text-indigo-200'
                : 'bg-slate-900 border-white/10 text-slate-400 hover:text-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-8 text-center text-xs text-slate-500">
            No study tasks in this category yet. Add one above!
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                task.completed
                  ? 'bg-slate-950/40 border-white/5 opacity-60'
                  : 'bg-slate-900/90 border-white/10 hover:border-indigo-500/30'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={() => toggleTask(task.id)}
                  className={`w-6 h-6 rounded-xl border flex items-center justify-center transition-all ${
                    task.completed
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : 'border-slate-600 hover:border-indigo-400 bg-slate-950'
                  }`}
                >
                  {task.completed && <Check className="w-4 h-4 stroke-[3]" />}
                </button>

                <div>
                  <h4
                    className={`font-semibold text-xs text-slate-100 ${
                      task.completed ? 'line-through text-slate-400' : ''
                    }`}
                  >
                    {task.title}
                  </h4>
                  <span className="text-[10px] text-indigo-400 font-medium">{task.category}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-slate-950 border border-white/5 text-slate-300">
                  🍅 {task.completedPomodoros}/{task.estimatedPomodoros} Pomos
                </span>

                <button
                  onClick={() => deleteTask(task.id)}
                  className="p-1.5 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
