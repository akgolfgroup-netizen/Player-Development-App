// @ts-nocheck
import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Clock, Trophy, Target, CheckCircle2, Play, Bell, ChevronRight,
  Crosshair, Zap, Sparkles, Award, TrendingUp, Calendar, BarChart3
} from 'lucide-react'
import { useDashboard } from '../../hooks/useDashboard'
import { useFocus } from '../../hooks/useFocus'
import { CalendarOversiktWidget } from '../calendar-oversikt'
import { PageTitle, SectionTitle, SubSectionTitle, CardTitle as TypographyCardTitle } from '../../components/typography'

// shadcn/ui components
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Progress,
  Checkbox,
  ScrollArea,
} from '../../components/shadcn'
import {
  PlayerStatCard,
  StreakBadge,
  GoalProgress,
} from '../../components/shadcn/golf'

/**
 * AKGolfDashboard V4 - shadcn/ui Premium Redesign
 *
 * Upgraded from V3 with:
 * - shadcn/ui components for consistent, polished UI
 * - Tailwind CSS for styling
 * - Golf-specific premium components
 * - Better accessibility
 */

// ===== HELPER FUNCTIONS =====

const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return 'God morgen'
  if (hour < 18) return 'God dag'
  return 'God kveld'
}

const getDayOfWeek = () => new Date().getDay()

const getMotivationalMessage = (stats: any, dayOfWeek: number) => {
  const { sessionsCompleted = 0, sessionsTotal = 0, streak = 0 } = stats || {}
  const completionRate = sessionsTotal > 0 ? (sessionsCompleted / sessionsTotal) * 100 : 0

  if (streak > 7) return 'Imponerende streak! Hold momentumet.'
  if (streak > 3) return `${streak} dager i rad – du bygger gode vaner!`
  if (completionRate >= 100) return 'Uka fullført! Du er en maskin.'
  if (completionRate >= 75) return 'Nesten der – sterk innsats!'
  if (completionRate >= 50) return 'Halvveis – godt på vei!'
  if (completionRate >= 25) return 'God start på uka!'

  if (sessionsCompleted === 0) {
    if (dayOfWeek === 1) return 'Ny uke – sett standarden tidlig!'
    if (dayOfWeek === 0 || dayOfWeek === 6) return 'Helgetrening? Alltid bra!'
    if (dayOfWeek <= 3) return 'Kom i gang – uka har bare startet.'
    return 'Ny sjanse i dag!'
  }

  return 'Hver økt teller.'
}

const COMPONENT_LABELS: Record<string, string> = {
  OTT: 'Utslag',
  APP: 'Innspill',
  ARG: 'Kortspill',
  PUTT: 'Putting',
}

// ===== WELCOME SECTION =====

interface WelcomeSectionProps {
  playerName: string
  avatarUrl?: string
  stats: any
  streak: number
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({ playerName, avatarUrl, stats, streak }) => {
  const dayOfWeek = getDayOfWeek()
  const motivationalMessage = getMotivationalMessage(stats, dayOfWeek)
  const firstName = playerName?.split(' ')[0] || 'Spiller'
  const initials = playerName
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'SP'

  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-5">
        {/* Profile Avatar */}
        <div className="relative">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center overflow-hidden ring-4 ring-white shadow-ak-elevated"
            style={{ background: 'linear-gradient(135deg, var(--ak-primary) 0%, var(--ak-primary-dark) 100%)' }}
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={firstName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xl font-bold text-white">{initials}</span>
            )}
          </div>
          {streak > 0 && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-xs shadow-ak-sm">
              🔥
            </div>
          )}
        </div>

        {/* Text Content */}
        <div className="space-y-1">
          <p className="text-caption-2 text-ak-text-tertiary uppercase tracking-wider font-medium">
            {getGreeting()}
          </p>
          <PageTitle className="text-title-1 text-ak-text-primary tracking-tight">
            {firstName}
          </PageTitle>
          <p className="text-subhead text-ak-text-secondary font-medium">
            {motivationalMessage}
          </p>
        </div>
      </div>

      {streak > 0 && <StreakBadge count={streak} size="lg" />}
    </div>
  )
}

// ===== WEEK AT GLANCE CARD =====

interface WeekAtGlanceCardProps {
  stats: any
  loading?: boolean
}

const WeekAtGlanceCard: React.FC<WeekAtGlanceCardProps> = ({ stats, loading }) => {
  if (loading) {
    return (
      <Card className="h-full shadow-ak-card rounded-ak-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-headline">
            <Calendar className="h-5 w-5 text-ak-brand-primary" />
            Denne uken
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6 animate-pulse">
            <div className="h-16 bg-ak-surface-subtle rounded-ak-sm" />
            <div className="h-16 bg-ak-surface-subtle rounded-ak-sm" />
            <div className="h-16 bg-ak-surface-subtle rounded-ak-sm" />
          </div>
        </CardContent>
      </Card>
    )
  }

  const sessionsPercent = stats.sessionsTotal > 0
    ? Math.min(Math.round((stats.sessionsCompleted / stats.sessionsTotal) * 100), 100)
    : 0
  const hoursPercent = stats.hoursGoal > 0
    ? Math.min(Math.round((stats.hoursThisWeek / stats.hoursGoal) * 100), 100)
    : 0

  return (
    <Card className="h-full shadow-ak-card rounded-ak-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-headline">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--accent-muted)' }}>
              <Calendar className="h-5 w-5" style={{ color: 'var(--ak-primary)' }} />
            </div>
            Denne uken
          </CardTitle>
          {stats.streak > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 rounded-full">
              <span className="text-sm">🔥</span>
              <span className="text-subhead font-semibold text-orange-600">{stats.streak} dager</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-6">
          {/* Planned Sessions */}
          <div className="space-y-2">
            <div className="flex justify-between items-baseline">
              <span className="text-subhead text-ak-text-secondary">Planlagte økter</span>
              <span className="text-subhead font-semibold tabular-nums text-ak-text-primary">
                {stats.sessionsCompleted} av {stats.sessionsTotal}
              </span>
            </div>
            <Progress
              value={sessionsPercent}
              className="h-2 bg-ak-component-progress-bg"
              indicatorClassName={sessionsPercent >= 100 ? 'bg-ak-component-progress-success' : 'bg-ak-component-progress-fill'}
            />
            <span className="text-caption-1 text-ak-text-tertiary">
              {sessionsPercent >= 100 ? 'Mål nådd!' : `${100 - sessionsPercent}% gjenstår`}
            </span>
          </div>

          {/* Training Hours */}
          <div className="space-y-2">
            <div className="flex justify-between items-baseline">
              <span className="text-subhead text-ak-text-secondary">Treningstimer</span>
              <span className="text-subhead font-semibold tabular-nums text-ak-text-primary">
                {stats.hoursThisWeek}t av {stats.hoursGoal}t
              </span>
            </div>
            <Progress
              value={hoursPercent}
              className="h-2 bg-ak-component-progress-bg"
              indicatorClassName={hoursPercent >= 100 ? 'bg-ak-component-progress-success' : 'bg-ak-component-progress-fill'}
            />
            <span className="text-caption-1 text-ak-text-tertiary">
              {hoursPercent >= 100 ? 'Måltimer nådd!' : `${stats.hoursGoal - stats.hoursThisWeek}t gjenstår`}
            </span>
          </div>

          {/* Completed Last 7 Days */}
          <div className="space-y-2">
            <div className="flex justify-between items-baseline">
              <span className="text-subhead text-ak-text-secondary">Fullført siste 7 dager</span>
              <span className="text-subhead font-semibold tabular-nums text-ak-text-primary">{stats.sessionsCompleted} økter</span>
            </div>
            <div className="flex items-center gap-2 py-2">
              <CheckCircle2
                className={`h-4 w-4 ${stats.sessionsCompleted > 0 ? 'text-ak-status-success' : 'text-ak-text-tertiary'}`}
              />
              <span className="text-subhead text-ak-text-secondary">
                {stats.sessionsCompleted > 0
                  ? `${Math.round(stats.hoursThisWeek)} timer totalt`
                  : 'Ingen økter ennå'}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ===== BADGES & SCORE CARD =====

interface BadgesScoreCardProps {
  xp: number
  totalXp: number
  level: number
  nextLevelXp: number
  achievements: any[]
  loading?: boolean
}

const BadgesScoreCard: React.FC<BadgesScoreCardProps> = ({
  xp, totalXp, level, nextLevelXp, achievements, loading
}) => {
  const getRankName = (lvl: number) => {
    if (lvl >= 20) return 'Mester'
    if (lvl >= 15) return 'Ekspert'
    if (lvl >= 10) return 'Avansert'
    if (lvl >= 5) return 'Ivrig'
    if (lvl >= 2) return 'Aktiv'
    return 'Nybegynner'
  }

  if (loading) {
    return (
      <Card className="h-full shadow-ak-card rounded-ak-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-headline">
            <Award className="h-5 w-5 text-ak-brand-primary" />
            Badges & Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-32 bg-ak-surface-subtle rounded-ak-sm animate-pulse" />
        </CardContent>
      </Card>
    )
  }

  const rankName = getRankName(level || 1)
  const xpProgress = nextLevelXp > 0 ? Math.min(Math.round((xp / nextLevelXp) * 100), 100) : 0
  const badgeCount = achievements?.length || 0

  return (
    <Card className="h-full flex flex-col shadow-ak-card rounded-ak-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-headline">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--achievement-muted)' }}>
            <Award className="h-5 w-5" style={{ color: 'var(--achievement)' }} />
          </div>
          Badges & Score
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 flex-1">
        {/* Rank Display */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--achievement-muted)' }}>
            <Trophy className="h-5 w-5" style={{ color: 'var(--achievement)' }} />
          </div>
          <div>
            <span className="text-stat-label text-ak-text-tertiary">RANK</span>
            <p className="text-title-3 text-ak-text-primary">{rankName}</p>
          </div>
        </div>

        {/* XP Progress */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-baseline">
            <span className="text-subhead font-semibold text-ak-text-primary">Level {level || 1}</span>
            <span className="text-subhead text-ak-text-secondary tabular-nums">{totalXp || 0} XP</span>
          </div>
          <Progress value={xpProgress} className="h-1.5 bg-ak-component-progress-bg" indicatorClassName="bg-ak-component-progress-fill" />
          <span className="text-caption-1 text-ak-text-tertiary">
            {xp || 0} / {nextLevelXp || 100} til neste nivå
          </span>
        </div>

        {/* Badges Count */}
        <div className="flex items-center gap-3 pt-3 border-t border-ak-border-muted mt-auto">
          <div className="flex items-baseline gap-1.5">
            <span className="text-title-2 tabular-nums text-ak-text-primary">{badgeCount}</span>
            <span className="text-subhead text-ak-text-secondary">badges opptjent</span>
          </div>
          {badgeCount > 0 && achievements?.slice(0, 3).map((badge, idx) => (
            <span key={badge.id || idx} className="text-xl">
              {badge.iconEmoji || '🏅'}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ===== LAST 7 DAYS VISUALIZATION =====

interface Last7DaysProps {
  calendarEvents: any[]
  stats: any
}

const Last7DaysVisualization: React.FC<Last7DaysProps> = ({ calendarEvents, stats }) => {
  const dayLabels = useMemo(() => {
    const days = ['Søn', 'Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør']
    const today = new Date()
    const result = []

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(today.getDate() - i)
      result.push({
        label: days[date.getDay()],
        date: date.toISOString().split('T')[0],
        isToday: i === 0,
        dayOfWeek: date.getDay(),
      })
    }
    return result
  }, [])

  const getDayStatus = (day: any, index: number) => {
    if (day.isToday && calendarEvents?.length > 0) return 'has-events'
    if (!day.isToday && index < 6 && stats.streak > (6 - index)) return 'completed'
    if (day.dayOfWeek === 0 || day.dayOfWeek === 6) return 'weekend'
    return 'empty'
  }

  return (
    <Card className="shadow-ak-card rounded-ak-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-subhead">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--accent-muted)' }}>
            <TrendingUp className="h-4 w-4" style={{ color: 'var(--ak-primary)' }} />
          </div>
          Siste 7 dager
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between gap-2">
          {dayLabels.map((day, index) => {
            const status = getDayStatus(day, index)
            return (
              <div key={day.date} className="flex flex-col items-center gap-2 flex-1">
                <span className={`text-caption-1 ${day.isToday ? 'text-ak-brand-primary font-semibold' : 'text-ak-text-tertiary'}`}>
                  {day.label}
                </span>
                <div className={`
                  w-full max-w-12 h-8 rounded-ak-sm flex items-center justify-center transition-all duration-ak-base
                  ${status === 'completed' ? 'bg-ak-status-success' : ''}
                  ${status === 'has-events' ? 'bg-ak-brand-primary' : ''}
                  ${status === 'weekend' ? 'bg-ak-surface-elevated' : ''}
                  ${status === 'empty' ? 'bg-ak-surface-subtle' : ''}
                  ${day.isToday ? 'ring-2 ring-ak-brand-primary' : 'border border-ak-border-muted'}
                `}>
                  {status === 'completed' && <CheckCircle2 className="h-3 w-3 text-ak-text-inverse" />}
                  {status === 'has-events' && <div className="w-2 h-2 rounded-full bg-ak-surface-card" />}
                </div>
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-5 mt-4 pt-3 border-t border-ak-border-muted">
          <div className="flex items-center gap-1.5 text-caption-1 text-ak-text-tertiary">
            <div className="w-2.5 h-2.5 rounded-ak-xs bg-ak-status-success" />
            <span>Fullført</span>
          </div>
          <div className="flex items-center gap-1.5 text-caption-1 text-ak-text-tertiary">
            <div className="w-2.5 h-2.5 rounded-ak-xs bg-ak-brand-primary" />
            <span>I dag</span>
          </div>
          <div className="flex items-center gap-1.5 text-caption-1 text-ak-text-tertiary">
            <div className="w-2.5 h-2.5 rounded-ak-xs bg-ak-surface-subtle border border-ak-border-muted" />
            <span>Ingen data</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ===== FOCUS CARD =====

interface FocusCardProps {
  focus: any
  loading?: boolean
}

const FocusCard: React.FC<FocusCardProps> = ({ focus, loading }) => {
  if (loading) {
    return (
      <Card className="border-l-4 shadow-ak-card rounded-ak-lg" style={{ borderLeftColor: 'var(--ak-primary)' }}>
        <CardContent className="pt-5">
          <div className="space-y-3 animate-pulse">
            <div className="h-4 bg-ak-surface-subtle rounded-ak-xs w-1/3" />
            <div className="h-6 bg-ak-surface-subtle rounded-ak-xs w-2/3" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!focus) {
    return (
      <Card className="border-l-4 shadow-ak-card rounded-ak-lg" style={{ borderLeftColor: 'var(--ak-primary)' }}>
        <CardContent className="pt-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--accent-muted)' }}>
              <Crosshair className="h-4 w-4" style={{ color: 'var(--ak-primary)' }} />
            </div>
            <span className="text-stat-label text-ak-text-secondary">
              UKENS FOKUS
            </span>
          </div>
          <SubSectionTitle className="text-title-3 text-ak-text-primary mb-2">Start din første økt</SubSectionTitle>
          <p className="text-subhead text-ak-text-secondary">
            Fullfør noen tester for å få personlig anbefaling
          </p>
        </CardContent>
      </Card>
    )
  }

  const focusLabel = COMPONENT_LABELS[focus.focusComponent] || focus.focusComponent
  const sessionsCompleted = focus.sessionsCompleted || 0
  const sessionsTarget = focus.sessionsTarget || 4
  const progressPercent = Math.round((sessionsCompleted / sessionsTarget) * 100)

  return (
    <Card className="border-l-4 shadow-ak-card rounded-ak-lg" style={{ borderLeftColor: 'var(--ak-primary)' }}>
      <CardContent className="pt-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--accent-muted)' }}>
              <Crosshair className="h-4 w-4" style={{ color: 'var(--ak-primary)' }} />
            </div>
            <span className="text-stat-label text-ak-text-secondary">
              UKENS FOKUS
            </span>
          </div>
          <span className="text-caption-1 font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: 'var(--accent-muted)', color: 'var(--ak-primary)' }}>
            {focusLabel}
          </span>
        </div>

        <SubSectionTitle className="text-title-3 text-ak-text-primary mb-2">
          {focus.approachWeakestBucket
            ? `${focusLabel}: ${focus.approachWeakestBucket.replace('_', '-')} yards`
            : focusLabel}
        </SubSectionTitle>

        {focus.reasonCodes?.length > 0 && (
          <p className="text-subhead text-ak-text-secondary mb-4">
            {focus.reasonCodes.includes(`weak_${focus.focusComponent.toLowerCase()}_test_cluster`)
              ? 'Dine tester viser forbedringspotensial her'
              : focus.reasonCodes.includes(`high_weight_${focus.focusComponent.toLowerCase()}`)
              ? 'Dette området har stor påvirkning på scoren din'
              : 'Anbefalt basert på din spillerprofil'}
          </p>
        )}

        <div className="flex items-center gap-3">
          <Progress value={progressPercent} className="flex-1 h-1.5 bg-ak-component-progress-bg" indicatorClassName="bg-ak-component-progress-fill" />
          <span className="text-caption-1 text-ak-text-tertiary font-medium whitespace-nowrap">
            {sessionsCompleted} av {sessionsTarget} økter
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

// ===== CONTEXTUAL CTA =====

interface ContextualCTAProps {
  focus: any
  upcomingSession: any
  onStart: (session: any) => void
}

const ContextualCTA: React.FC<ContextualCTAProps> = ({ focus, upcomingSession, onStart }) => {
  const ctaStyle = {
    backgroundColor: 'var(--ak-primary)',
    color: 'var(--text-inverse)',
  }

  if (upcomingSession) {
    const title = upcomingSession.title || 'Planlagt økt'
    const duration = upcomingSession.duration || 45

    return (
      <button
        className="w-full flex items-center justify-between h-auto py-4 px-5 rounded-xl shadow-ak-sm transition-all duration-200 hover:opacity-90 active:opacity-80"
        style={ctaStyle}
        onClick={() => onStart(upcomingSession)}
      >
        <div className="flex items-center gap-3">
          <Play className="h-5 w-5 text-white" />
          <div className="text-left">
            <span className="block text-headline font-semibold text-white">Start {title}</span>
            <span className="block text-caption-1 text-white/80">{duration} min · Fra din kalender</span>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-white/70" />
      </button>
    )
  }

  if (focus?.focusComponent) {
    const focusLabel = COMPONENT_LABELS[focus.focusComponent] || focus.focusComponent
    const sessionDuration = focus.recommendedDuration || 30

    return (
      <button
        className="w-full flex items-center justify-between h-auto py-4 px-5 rounded-xl shadow-ak-sm transition-all duration-200 hover:opacity-90 active:opacity-80"
        style={ctaStyle}
        onClick={() => onStart({ type: 'focus', focus })}
      >
        <div className="flex items-center gap-3">
          <Play className="h-5 w-5 text-white" />
          <div className="text-left">
            <span className="block text-headline font-semibold text-white">Start {focusLabel}-økt</span>
            <span className="block text-caption-1 text-white/80">{sessionDuration} min · Del av ukens mål</span>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-white/70" />
      </button>
    )
  }

  return (
    <button
      className="w-full flex items-center justify-between h-auto py-4 px-5 rounded-xl shadow-ak-sm transition-all duration-200 hover:opacity-90 active:opacity-80"
      style={ctaStyle}
      onClick={() => onStart({ type: 'quick' })}
    >
      <div className="flex items-center gap-3">
        <Play className="h-5 w-5 text-white" />
        <div className="text-left">
          <span className="block text-headline font-semibold text-white">Kom i gang</span>
          <span className="block text-caption-1 text-white/80">Velg en økt som passer deg i dag</span>
        </div>
      </div>
      <ChevronRight className="h-5 w-5 text-white/70" />
    </button>
  )
}

// ===== QUICK START CTA =====

const QuickStartCTA: React.FC<{ onStart: (session: any) => void }> = ({ onStart }) => (
  <Button
    variant="outline"
    className="w-full justify-center gap-2 border-dashed border-ak-border bg-ak-surface-card hover:bg-ak-surface-subtle rounded-ak-md transition-all duration-ak-base"
    onClick={() => onStart({ type: 'quick', duration: 15 })}
  >
    <Zap className="h-4 w-4 text-ak-text-secondary" />
    <span className="text-subhead text-ak-text-secondary">Bare 15 minutter? Start hurtigøkt</span>
    <ChevronRight className="h-3.5 w-3.5 text-ak-text-tertiary" />
  </Button>
)

// ===== TASKS LIST =====

interface TasksListProps {
  tasks: any[]
  onToggle: (id: string) => void
  onViewAll: () => void
  onStartTask: (task: any) => void
}

const TasksList: React.FC<TasksListProps> = ({ tasks, onToggle, onViewAll, onStartTask }) => {
  const completedCount = tasks.filter(t => t.completed).length
  const displayTasks = tasks.slice(0, 3)

  return (
    <Card className="shadow-ak-card rounded-ak-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-subhead">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--success-muted)' }}>
              <Target className="h-4 w-4" style={{ color: 'var(--success)' }} />
            </div>
            Dagens oppgaver
          </CardTitle>
          {tasks.length > 3 && (
            <Button variant="ghost" size="sm" onClick={onViewAll} className="text-caption-1 h-7 text-ak-brand-primary hover:text-ak-brand-primary-hover">
              +{tasks.length - 3} mer <ChevronRight className="h-3 w-3 ml-1" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {tasks.length === 0 ? (
          <div className="py-6 text-center">
            <Sparkles className="h-6 w-6 text-ak-text-tertiary mx-auto mb-2" />
            <p className="text-subhead text-ak-text-tertiary">Ingen oppgaver i dag – nyt friheten!</p>
          </div>
        ) : (
          <div className="space-y-1">
            {displayTasks.map(task => (
              <div
                key={task.id}
                className={`flex items-center gap-3 py-3 px-3 -mx-3 rounded-ak-sm transition-colors duration-ak-fast ${
                  task.completed ? 'bg-ak-status-success-muted' : 'hover:bg-ak-surface-subtle'
                }`}
              >
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => onToggle(task.id)}
                  className="h-4.5 w-4.5"
                />
                <span className={`flex-1 text-subhead font-medium ${
                  task.completed ? 'line-through text-ak-text-tertiary' : 'text-ak-text-primary'
                }`}>
                  {task.title}
                </span>
                {!task.completed && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-caption-1 h-7 text-ak-brand-primary hover:text-ak-brand-primary-hover hover:bg-ak-brand-primary-muted"
                    onClick={() => onStartTask(task)}
                  >
                    Start
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}

        {tasks.length > 0 && (
          <div className="pt-3 mt-3 border-t border-ak-border-muted text-caption-1 text-ak-text-tertiary">
            {completedCount === tasks.length ? (
              <span className="text-ak-status-success">✓ Alle fullført!</span>
            ) : (
              `${completedCount} av ${Math.min(tasks.length, 3)} fullført`
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// ===== NOTIFICATIONS LIST =====

interface NotificationsListProps {
  notifications: any[]
  onViewAll: () => void
}

const NotificationsList: React.FC<NotificationsListProps> = ({ notifications, onViewAll }) => {
  const displayNotifications = notifications.slice(0, 2)

  if (notifications.length === 0) return null

  return (
    <Card className="shadow-ak-card rounded-ak-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-subhead">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--info-muted)' }}>
              <Bell className="h-4 w-4" style={{ color: 'var(--info)' }} />
            </div>
            Varslinger
            {notifications.length > 0 && (
              <span className="text-caption-1 font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--info-muted)', color: 'var(--info)' }}>
                {notifications.length}
              </span>
            )}
          </CardTitle>
          {notifications.length > 2 && (
            <Button variant="ghost" size="sm" onClick={onViewAll} className="text-caption-1 h-7 text-ak-brand-primary hover:text-ak-brand-primary-hover">
              Se alle <ChevronRight className="h-3 w-3 ml-1" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-1">
          {displayNotifications.map((notif, idx) => (
            <div key={notif.id || idx} className="flex items-start gap-3 py-3">
              <div className="w-2 h-2 rounded-full bg-ak-brand-primary mt-2 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-subhead font-medium text-ak-text-primary">{notif.title}</p>
                <p className="text-subhead text-ak-text-secondary truncate">{notif.message}</p>
              </div>
              <span className="text-caption-1 text-ak-text-tertiary flex-shrink-0">{notif.time || 'Nylig'}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ===== MAIN DASHBOARD =====

const AKGolfDashboardV4: React.FC = () => {
  const navigate = useNavigate()
  const { data: dashboardData, loading } = useDashboard()
  const { data: focusData, loading: focusLoading } = useFocus()
  const [tasks, setTasks] = useState<any[]>([])

  useEffect(() => {
    if (dashboardData?.tasks) {
      setTasks(dashboardData.tasks)
    }
  }, [dashboardData])

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  }

  // Extract data with fallbacks
  const player = dashboardData?.player || { name: 'Spiller', category: 'B', avatarUrl: null }
  const stats = dashboardData?.stats || {
    sessionsCompleted: 0,
    sessionsTotal: 12,
    hoursThisWeek: 0,
    hoursGoal: 20,
    streak: 0,
  }
  const notifications = dashboardData?.notifications || []
  const xp = dashboardData?.xp || 0
  const totalXp = dashboardData?.totalXp || 0
  const level = dashboardData?.level || 1
  const nextLevelXp = dashboardData?.nextLevelXp || 100
  const achievements = dashboardData?.achievements || []
  const calendarEvents = dashboardData?.calendarEvents || []

  const handleStartSession = (session: any) => {
    if (session?.id) {
      navigate(`/session/${session.id}/active`)
    } else if (session?.type === 'focus') {
      navigate('/session/new', { state: { focus: session.focus } })
    } else {
      navigate('/session/new', { state: { quickStart: true, duration: session?.duration || 15 } })
    }
  }

  const handleStartTaskSession = (task: any) => {
    navigate('/session/new', { state: { taskId: task.id, taskTitle: task.title } })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-subhead text-ak-text-tertiary">Laster dashboard...</div>
      </div>
    )
  }

  return (
    <div className="w-full px-6 py-6 space-y-6 bg-ak-surface-base min-h-screen">
      {/* Row 1: Welcome Header */}
      <WelcomeSection
        playerName={player.name}
        avatarUrl={player.avatarUrl}
        stats={stats}
        streak={stats.streak}
      />

      {/* Row 2: Week at a Glance (8-col) + Badges & Score (4-col) */}
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 lg:col-span-8">
          <WeekAtGlanceCard stats={stats} loading={loading} />
        </div>
        <div className="col-span-12 lg:col-span-4">
          <BadgesScoreCard
            xp={xp}
            totalXp={totalXp}
            level={level}
            nextLevelXp={nextLevelXp}
            achievements={achievements}
            loading={loading}
          />
        </div>
      </div>

      {/* Row 3: Calendar Oversikt Widget + Last 7 Days */}
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 lg:col-span-5">
          <CalendarOversiktWidget />
        </div>
        <div className="col-span-12 lg:col-span-7">
          <Last7DaysVisualization calendarEvents={calendarEvents} stats={stats} />
        </div>
      </div>

      {/* Row 4: Main content - Focus + Tasks side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left Column: Focus + CTA */}
        <div className="space-y-4">
          <FocusCard focus={focusData} loading={focusLoading} />
          <ContextualCTA
            focus={focusData}
            upcomingSession={dashboardData?.upcomingSessions?.[0]}
            onStart={handleStartSession}
          />
          <QuickStartCTA onStart={handleStartSession} />
        </div>

        {/* Right Column: Tasks + Notifications */}
        <div className="space-y-4">
          <TasksList
            tasks={tasks}
            onToggle={toggleTask}
            onViewAll={() => navigate('/maalsetninger')}
            onStartTask={handleStartTaskSession}
          />
          <NotificationsList
            notifications={notifications}
            onViewAll={() => navigate('/varslinger')}
          />
        </div>
      </div>
    </div>
  )
}

export default AKGolfDashboardV4
