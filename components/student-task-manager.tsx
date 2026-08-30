'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  Bell,
  BookOpen,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  Circle,
  Clock3,
  Filter,
  LayoutDashboard,
  ListTodo,
  MoreHorizontal,
  Plus,
  Search,
  Sparkles,
  Target,
  Trash2,
  X,
} from 'lucide-react'

type Priority = 'High' | 'Medium' | 'Low'
type Status = 'To do' | 'In progress' | 'Completed'

type Task = {
  id: number
  title: string
  subject: string
  due: string
  dueLabel: string
  priority: Priority
  status: Status
  color: string
}

const starterTasks: Task[] = [
  { id: 1, title: 'Complete calculus problem set', subject: 'Mathematics', due: '2026-08-30', dueLabel: 'Today, 6:00 PM', priority: 'High', status: 'In progress', color: 'coral' },
  { id: 2, title: 'Read chapter 8 and take notes', subject: 'Biology', due: '2026-09-01', dueLabel: 'Mon, Sep 1', priority: 'Medium', status: 'To do', color: 'blue' },
  { id: 3, title: 'Draft history essay outline', subject: 'World History', due: '2026-09-02', dueLabel: 'Tue, Sep 2', priority: 'Medium', status: 'To do', color: 'violet' },
  { id: 4, title: 'Review flashcards for quiz', subject: 'Computer Science', due: '2026-08-29', dueLabel: 'Yesterday', priority: 'Low', status: 'Completed', color: 'mint' },
  { id: 5, title: 'Prepare presentation slides', subject: 'Design Studio', due: '2026-09-04', dueLabel: 'Thu, Sep 4', priority: 'Low', status: 'To do', color: 'amber' },
]

const colorMap: Record<string, string> = {
  coral: 'var(--coral)', blue: 'var(--blue)', violet: 'var(--violet)', mint: 'var(--mint)', amber: 'var(--amber)',
}

export function StudentTaskManager() {
  const [tasks, setTasks] = useState<Task[]>(starterTasks)
  const [filter, setFilter] = useState<'All' | Status>('All')
  const [query, setQuery] = useState('')
  const [showComposer, setShowComposer] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newSubject, setNewSubject] = useState('')

  useEffect(() => {
    const saved = window.localStorage.getItem('student-task-manager-tasks')
    if (saved) setTasks(JSON.parse(saved))
  }, [])

  useEffect(() => {
    window.localStorage.setItem('student-task-manager-tasks', JSON.stringify(tasks))
  }, [tasks])

  const visibleTasks = useMemo(() => tasks.filter((task) => {
    const matchesFilter = filter === 'All' || task.status === filter
    const matchesQuery = `${task.title} ${task.subject}`.toLowerCase().includes(query.toLowerCase())
    return matchesFilter && matchesQuery
  }), [tasks, filter, query])

  const completed = tasks.filter((task) => task.status === 'Completed').length
  const inProgress = tasks.filter((task) => task.status === 'In progress').length
  const dueSoon = tasks.filter((task) => task.status !== 'Completed' && task.due <= '2026-09-02').length
  const completion = tasks.length ? Math.round((completed / tasks.length) * 100) : 0

  function toggleTask(id: number) {
    setTasks((current) => current.map((task) => task.id === id ? { ...task, status: task.status === 'Completed' ? 'To do' : 'Completed' } : task))
  }

  function addTask(event: React.FormEvent) {
    event.preventDefault()
    if (!newTitle.trim()) return
    setTasks((current) => [{ id: Date.now(), title: newTitle.trim(), subject: newSubject.trim() || 'Personal', due: '2026-09-03', dueLabel: 'Thu, Sep 3', priority: 'Medium', status: 'To do', color: 'blue' }, ...current])
    setNewTitle(''); setNewSubject(''); setShowComposer(false)
  }

  function deleteTask(id: number) { setTasks((current) => current.filter((task) => task.id !== id)) }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark"><Sparkles size={17} /></span><span>StudyFlow</span></div>
        <div className="profile-card"><div className="avatar">AM</div><div><strong>Alex Morgan</strong><span>Semester 4 · Computer Science</span></div><ChevronDown size={16} /></div>
        <nav className="nav-list" aria-label="Main navigation">
          <a className="nav-item active" href="#overview"><LayoutDashboard size={18} />Overview</a>
          <a className="nav-item" href="#tasks"><ListTodo size={18} />My Tasks<span className="nav-count">{tasks.filter((t) => t.status !== 'Completed').length}</span></a>
          <a className="nav-item" href="#calendar"><CalendarDays size={18} />Calendar</a>
          <a className="nav-item" href="#subjects"><BookOpen size={18} />Subjects</a>
        </nav>
        <div className="sidebar-bottom"><div className="tip-card"><Sparkles size={18} /><strong>Small steps, big progress.</strong><span>Keep your momentum going today.</span><div className="tip-progress"><span style={{ width: `${completion}%` }} /></div></div><a className="nav-item muted" href="#settings"><span className="settings-dot" />Settings</a></div>
      </aside>

      <main className="main-content" id="overview">
        <header className="topbar"><div className="mobile-brand brand"><span className="brand-mark"><Sparkles size={17} /></span>StudyFlow</div><div className="date-label"><CalendarDays size={16} />Saturday, August 30, 2026</div><div className="top-actions"><button className="icon-button" aria-label="Notifications"><Bell size={18} /><span className="notification-dot" /></button><div className="mini-avatar">AM</div></div></header>
        <section className="welcome-row"><div><p className="eyebrow">YOUR LEARNING SPACE</p><h1>Good morning, Alex <span className="wave">✦</span></h1><p className="subtitle">Let&apos;s make today count. You&apos;re closer than you think.</p></div><button className="primary-button" onClick={() => setShowComposer(true)}><Plus size={18} />Add new task</button></section>

        <section className="stat-grid" aria-label="Task summary">
          <div className="stat-card stat-coral"><div className="stat-icon"><Target size={19} /></div><div><span>Due soon</span><strong>{dueSoon}</strong><small>tasks in next 3 days</small></div></div>
          <div className="stat-card stat-blue"><div className="stat-icon"><Clock3 size={19} /></div><div><span>In progress</span><strong>{inProgress}</strong><small>keep the momentum going</small></div></div>
          <div className="stat-card stat-mint"><div className="stat-icon"><CheckCircle2 size={19} /></div><div><span>Completed</span><strong>{completed}</strong><small>{completion}% of all tasks</small></div></div>
          <div className="progress-card"><div className="progress-ring" style={{ '--progress': `${completion * 3.6}deg` } as React.CSSProperties}><strong>{completion}%</strong><span>done</span></div><div><span className="progress-title">Weekly progress</span><small>Great work this week.<br />Stay consistent!</small></div></div>
        </section>

        <section className="task-section" id="tasks"><div className="section-heading"><div><h2>Your tasks</h2><p>Stay organized and focus on what matters.</p></div><button className="text-button">View calendar <span>→</span></button></div><div className="toolbar"><div className="search-wrap"><Search size={17} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search tasks..." aria-label="Search tasks" /></div><div className="filter-group" role="group" aria-label="Filter tasks">{(['All', 'To do', 'In progress', 'Completed'] as const).map((item) => <button key={item} className={filter === item ? 'filter-button selected' : 'filter-button'} onClick={() => setFilter(item)}>{item}</button>)}</div><button className="filter-icon" aria-label="More filters"><Filter size={17} /></button></div>
          <div className="task-list">{visibleTasks.map((task, index) => <article className={`task-row ${task.status === 'Completed' ? 'is-complete' : ''}`} key={task.id} style={{ '--delay': `${index * 60}ms` } as React.CSSProperties}><button className={`check-button ${task.status === 'Completed' ? 'checked' : ''}`} onClick={() => toggleTask(task.id)} aria-label={`Mark ${task.title} ${task.status === 'Completed' ? 'incomplete' : 'complete'}`}>{task.status === 'Completed' && <Check size={15} />}</button><div className="task-color" style={{ background: colorMap[task.color] }} /><div className="task-main"><h3>{task.title}</h3><span className="subject-label">{task.subject}</span></div><span className={`priority ${task.priority.toLowerCase()}`}>{task.priority}</span><div className="task-due"><CalendarDays size={15} /><span>{task.dueLabel}</span></div><span className={`status-dot ${task.status.toLowerCase().replace(' ', '-')}`} title={task.status} /><button className="row-action" aria-label={`Delete ${task.title}`} onClick={() => deleteTask(task.id)}><Trash2 size={16} /></button></article>)}{visibleTasks.length === 0 && <div className="empty-state"><Search size={24} /><strong>No tasks found</strong><span>Try a different search or filter.</span></div>}</div>
        </section>
        <footer className="footer-note"><span><CheckCircle2 size={15} />Everything is saved automatically</span><span>StudyFlow · Built for better study days</span></footer>
      </main>

      {showComposer && <div className="modal-backdrop" role="presentation" onClick={() => setShowComposer(false)}><form className="composer" onSubmit={addTask} onClick={(e) => e.stopPropagation()}><div className="composer-head"><div><p className="eyebrow">NEW TASK</p><h2>Add a task</h2></div><button type="button" className="icon-button" onClick={() => setShowComposer(false)} aria-label="Close"><X size={18} /></button></div><label>Task title<input autoFocus value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="e.g. Finish reading assignment" /></label><label>Subject or category<input value={newSubject} onChange={(e) => setNewSubject(e.target.value)} placeholder="e.g. Biology" /></label><button className="primary-button" type="submit"><Plus size={18} />Create task</button></form></div>}
    </div>
  )
}

export default StudentTaskManager
