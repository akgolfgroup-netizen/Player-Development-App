import * as React from "react"
import { Target, CheckCircle2, Clock } from "lucide-react"
import { cn } from "lib/utils"
import { Card, CardContent } from "../card"
import { Progress } from "../progress"

interface GoalProgressProps {
  title: string
  description?: string
  current: number
  target: number
  unit?: string
  deadline?: string
  status?: "on_track" | "behind" | "completed" | "at_risk"
  showCard?: boolean
  size?: "sm" | "md" | "lg"
  className?: string
}

const statusConfig = {
  on_track: {
    label: "På sporet",
    color: "text-ak-success",
    bgColor: "bg-ak-success",
    icon: Target,
  },
  behind: {
    label: "Bak skjema",
    color: "text-ak-warning",
    bgColor: "bg-ak-warning",
    icon: Clock,
  },
  completed: {
    label: "Fullført",
    color: "text-ak-success",
    bgColor: "bg-ak-success",
    icon: CheckCircle2,
  },
  at_risk: {
    label: "Risiko",
    color: "text-ak-error",
    bgColor: "bg-ak-error",
    icon: Target,
  },
}

const sizeConfig = {
  sm: {
    title: "text-sm font-medium",
    value: "text-lg font-bold",
    progress: "h-1.5",
  },
  md: {
    title: "text-base font-medium",
    value: "text-2xl font-bold",
    progress: "h-2",
  },
  lg: {
    title: "text-lg font-semibold",
    value: "text-3xl font-bold",
    progress: "h-3",
  },
}

export const GoalProgress: React.FC<GoalProgressProps> = ({
  title,
  description,
  current,
  target,
  unit = "",
  deadline,
  status = "on_track",
  showCard = true,
  size = "md",
  className,
}) => {
  const percentage = Math.min(Math.round((current / target) * 100), 100)
  const statusInfo = statusConfig[status]
  const sizes = sizeConfig[size]
  const StatusIcon = statusInfo.icon

  const content = (
    <div className="space-y-3">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h4 className={cn("text-text-primary", sizes.title)}>{title}</h4>
          {description && (
            <p className="text-sm text-text-secondary">{description}</p>
          )}
        </div>
        <div className={cn("flex items-center gap-1 text-xs font-medium", statusInfo.color)}>
          <StatusIcon className="h-3.5 w-3.5" />
          {statusInfo.label}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <span className={cn("tabular-nums text-text-primary", sizes.value)}>
            {current}
            <span className="text-sm font-normal text-text-secondary ml-1">
              / {target} {unit}
            </span>
          </span>
          <span className="text-sm font-medium text-text-secondary">
            {percentage}%
          </span>
        </div>
        <Progress
          value={percentage}
          className={sizes.progress}
          indicatorClassName={statusInfo.bgColor}
        />
      </div>

      {deadline && (
        <div className="flex items-center gap-1.5 text-xs text-text-tertiary">
          <Clock className="h-3 w-3" />
          <span>Frist: {deadline}</span>
        </div>
      )}
    </div>
  )

  if (!showCard) {
    return <div className={className}>{content}</div>
  }

  return (
    <Card className={className}>
      <CardContent className="pt-4">{content}</CardContent>
    </Card>
  )
}

export default GoalProgress
