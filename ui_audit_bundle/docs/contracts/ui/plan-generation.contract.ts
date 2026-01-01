/**
 * UI CONTRACT: Training Plan Generation & Preview
 *
 * This contract defines the behavior for viewing, understanding, and accepting
 * a generated 12-month training plan.
 *
 * Philosophy: The plan is complex (52 weeks, 365 days). This screen must make
 * it comprehensible without overwhelming the player.
 */

export const PlanGenerationContract = {
  /**
   * SCREEN IDENTITY
   */
  screen: "PlanPreviewScreen",
  version: "1.0.0",
  primaryGoal: "Help player understand and accept their personalized 12-month training plan",

  /**
   * ROLES & PERMISSIONS
   */
  allowedRoles: ["player", "coach"],
  roleCapabilities: {
    player: ["view_own_plan", "accept_plan", "request_modifications", "reject_plan"],
    coach: ["view_all_plans", "modify_plan", "approve_plan", "regenerate_plan"]
  },

  /**
   * REQUIRED CONTEXT
   */
  requiredContext: {
    planId: {
      type: "UUID",
      source: "route_param | previous_screen_result",
      validation: "Plan must exist and belong to player's tenant"
    },
    playerId: {
      type: "UUID",
      source: "auth_session",
      validation: "Must match plan owner (or coach has access)"
    }
  },

  /**
   * DATA STRUCTURE
   * What the plan contains (from backend)
   */
  planStructure: {
    annualPlan: {
      id: "UUID",
      playerId: "UUID",
      planName: "string",
      startDate: "date",
      endDate: "date",
      status: "'active' | 'draft' | 'completed' | 'archived'",
      baselineAverageScore: "number",
      baselineHandicap: "number",
      baselineDriverSpeed: "number | null",
      playerCategory: "'E1' | 'A1' | 'I1' | 'D1' | 'B1'",
      weeklyHoursTarget: "number (8-25)",
      basePeriodWeeks: "number",
      specializationWeeks: "number",
      tournamentWeeks: "number"
    },

    periodizations: {
      count: 52,
      structure: "array<object>",
      fields: {
        weekNumber: "number (1-52)",
        startDate: "date",
        endDate: "date",
        period: "'E' | 'G' | 'S' | 'T'",
        learningPhase: "'L1' | 'L2' | 'L3' | 'L4' | 'L5'",
        setting: "'S1' | 'S2' | ... | 'S10'",
        clubSpeed: "'CS20' | 'CS40' | 'CS70' | 'CS90' | 'CS110' | 'CS120'",
        weeklyHours: "number",
        priorities: "array<string>"
      }
    },

    dailyAssignments: {
      count: 365,
      structure: "array<object>",
      fields: {
        assignedDate: "date",
        weekNumber: "number (1-52)",
        dayOfWeek: "number (0-6)",
        sessionType: "string",
        estimatedDuration: "number (minutes)",
        period: "'E' | 'G' | 'S' | 'T'",
        isRestDay: "boolean",
        isOptional: "boolean"
      }
    },

    tournaments: {
      structure: "array<object>",
      fields: {
        name: "string",
        startDate: "date",
        endDate: "date",
        importance: "'A' | 'B' | 'C'",
        weekNumber: "number",
        toppingStartWeek: "number | null",
        toppingDurationWeeks: "number",
        taperingDurationDays: "number"
      }
    }
  },

  /**
   * VIEW MODES
   * Different ways to visualize the plan
   */
  viewModes: {
    overview: {
      description: "High-level summary of entire plan",
      displays: [
        "Timeline visualization (52 weeks)",
        "Period breakdown (E/G/S/T weeks)",
        "Tournament markers",
        "Weekly hours chart",
        "Key metrics summary"
      ],
      defaultView: true
    },

    calendar: {
      description: "Month-by-month calendar view",
      displays: [
        "Calendar grid with daily sessions",
        "Rest days highlighted",
        "Tournament dates marked",
        "Current week highlighted",
        "Click day → see session details"
      ]
    },

    weekly: {
      description: "Week-by-week detailed view",
      displays: [
        "7-day view of current week",
        "Each session with type, duration, period",
        "Weekly hours total",
        "Week goals and priorities",
        "Navigation to prev/next week"
      ],
      initialWeek: "current week | week 1 if plan not started"
    },

    periodization: {
      description: "Focus on training periods and progression",
      displays: [
        "Period blocks visualization",
        "Learning phase progression (L1→L5)",
        "Setting progression (S1→S10)",
        "Club speed levels by period",
        "Intensity curve over time"
      ]
    },

    tournaments: {
      description: "Tournament-centric view",
      displays: [
        "Tournament timeline",
        "Topping and tapering periods",
        "Preparation weeks for each tournament",
        "Priority level (A/B/C)",
        "Expected readiness indicators"
      ]
    }
  },

  /**
   * STATE MACHINE
   */
  states: {
    loading: {
      description: "Fetching plan data from API",
      allowedActions: [],
      apiCall: "GET /api/v1/training-plan/:planId/full",
      timeout: 5000,
      onTimeout: "error_system"
    },

    viewing: {
      description: "Plan loaded, user exploring different views",
      allowedActions: [
        "switch_view_mode",
        "navigate_week",
        "view_session_details",
        "accept_plan",
        "request_modifications",
        "reject_plan",
        "export_plan"
      ],
      canNavigateAway: true,
      persistViewMode: true // Remember last used view mode
    },

    viewing_session_details: {
      description: "Modal/detail view of a specific session",
      allowedActions: [
        "close_details",
        "mark_as_favorite",
        "add_note",
        "swap_with_alternative"
      ],
      canNavigateAway: false, // Modal is open
      displayData: {
        sessionType: "string",
        duration: "number",
        exercises: "array<object>",
        equipment: "array<string>",
        goals: "string",
        instructions: "string"
      }
    },

    accepting: {
      description: "PUT /api/v1/training-plan/:planId/accept in progress",
      allowedActions: [],
      apiCall: "PUT /api/v1/training-plan/:planId/accept",
      timeout: 3000
    },

    accepted: {
      description: "Plan accepted and activated",
      allowedActions: ["start_training", "view_today", "exit_to_dashboard"],
      autoNavigation: {
        delay: 3000,
        destination: "DashboardScreen",
        message: "Your training plan is now active!",
        userCanCancel: true
      }
    },

    requesting_modifications: {
      description: "User wants changes (coach will review)",
      allowedActions: [
        "specify_concerns",
        "submit_modification_request",
        "cancel"
      ],
      displayData: {
        concernAreas: "array<string> (tournaments, weekly hours, rest days, etc.)",
        additionalNotes: "string"
      }
    },

    modification_requested: {
      description: "Modification request submitted",
      allowedActions: ["exit_to_dashboard"],
      displayData: {
        requestId: "UUID",
        status: "'pending_coach_review'",
        message: "Your coach will review your request within 24-48 hours"
      },
      autoNavigation: {
        delay: 5000,
        destination: "DashboardScreen"
      }
    },

    rejecting: {
      description: "User confirms plan rejection",
      allowedActions: [
        "specify_rejection_reason",
        "confirm_rejection",
        "cancel"
      ],
      confirmationRequired: {
        message: "Are you sure? This will archive this plan and you'll need to create a new intake.",
        severity: "warning"
      }
    },

    rejected: {
      description: "Plan rejected and archived",
      apiCall: "PUT /api/v1/training-plan/:planId/reject",
      sideEffects: [
        "Plan status → 'archived'",
        "Unlink from intake (allow new plan generation)",
        "Notify coach"
      ],
      autoNavigation: {
        immediate: true,
        destination: "IntakeFormScreen",
        message: "Plan archived. You can create a new intake form."
      }
    },

    error_not_found: {
      description: "Plan doesn't exist or user doesn't have access",
      allowedActions: ["return_to_dashboard"],
      displayData: {
        errorCode: "PLAN_NOT_FOUND",
        message: "Training plan not found or you don't have access to it"
      }
    },

    error_system: {
      description: "Server error or network failure",
      allowedActions: ["retry", "return_to_dashboard"],
      preserveState: true
    }
  },

  /**
   * STATE TRANSITIONS
   */
  transitions: {
    "idle → loading": {
      trigger: "screen mounted with planId",
      validation: "planId is valid UUID"
    },

    "loading → viewing": {
      trigger: "API returns 200 with plan data",
      payload: "{ annualPlan, periodizations, dailyAssignments, tournaments }",
      sideEffects: [
        "Set default view mode (overview)",
        "Calculate current week if plan is active",
        "Pre-process data for visualizations"
      ]
    },

    "loading → error_not_found": {
      trigger: "API returns 404",
      sideEffects: ["Show error message", "Offer 'Return to Dashboard'"]
    },

    "loading → error_system": {
      trigger: "API returns 500 | timeout | network error",
      sideEffects: ["Preserve planId for retry"]
    },

    "viewing → viewing_session_details": {
      trigger: "user clicks on a specific day/session",
      validation: "session exists for that date"
    },

    "viewing_session_details → viewing": {
      trigger: "user closes detail modal",
      sideEffects: ["Return to previous view mode and scroll position"]
    },

    "viewing → accepting": {
      trigger: "user clicks 'Accept Plan'",
      validation: "plan status is 'draft'",
      confirmationRequired: {
        message: "Accept this training plan? It will become your active plan.",
        severity: "info"
      }
    },

    "accepting → accepted": {
      trigger: "API returns 200",
      sideEffects: [
        "Plan status → 'active'",
        "Show success message",
        "Enable daily session tracking"
      ]
    },

    "viewing → requesting_modifications": {
      trigger: "user clicks 'Request Changes'",
      validation: "none"
    },

    "requesting_modifications → modification_requested": {
      trigger: "user submits modification request",
      validation: "at least one concern specified OR notes provided",
      apiCall: "POST /api/v1/training-plan/:planId/modification-request"
    },

    "viewing → rejecting": {
      trigger: "user clicks 'Reject Plan'",
      validation: "none"
    },

    "rejecting → rejected": {
      trigger: "user confirms rejection",
      validation: "rejection reason provided"
    }
  },

  /**
   * API BINDINGS
   */
  apiBindings: {
    loadPlan: {
      method: "GET",
      endpoint: "/api/v1/training-plan/:planId/full",
      authentication: "required",

      request: {
        params: {
          planId: "UUID"
        },
        query: {
          includeSessionDetails: "boolean (default false)",
          includeExercises: "boolean (default false)"
        }
      },

      responses: {
        200: {
          state: "viewing",
          body: {
            success: true,
            data: {
              annualPlan: "object",
              periodizations: "array<object> (52 items)",
              dailyAssignments: "array<object> (365 items)",
              tournaments: "array<object>",
              statistics: {
                totalRestDays: "number",
                averageSessionDuration: "number",
                periodBreakdown: "object (E/G/S/T counts)"
              }
            }
          },
          sideEffects: [
            "Render overview visualization",
            "Calculate current week",
            "Pre-load calendar data"
          ]
        },

        404: {
          state: "error_not_found",
          body: {
            success: false,
            error: {
              code: "PLAN_NOT_FOUND",
              message: "Training plan not found"
            }
          }
        },

        403: {
          state: "error_not_found", // Same user experience as 404
          body: {
            success: false,
            error: {
              code: "ACCESS_DENIED",
              message: "You don't have permission to view this plan"
            }
          }
        },

        500: {
          state: "error_system"
        }
      }
    },

    acceptPlan: {
      method: "PUT",
      endpoint: "/api/v1/training-plan/:planId/accept",
      authentication: "required",

      preconditions: {
        planStatus: {
          check: "plan.status === 'draft'",
          onFail: "show error: 'Plan is already active or archived'"
        },
        ownership: {
          check: "plan.playerId === currentUser.playerId OR currentUser.role === 'coach'",
          onFail: "403 error"
        }
      },

      responses: {
        200: {
          state: "accepted",
          body: {
            success: true,
            data: {
              planId: "UUID",
              status: "'active'",
              activatedAt: "date"
            }
          },
          sideEffects: [
            "Plan appears in dashboard as active",
            "Daily sessions become trackable",
            "Show success message: 'Training plan activated!'"
          ]
        },

        400: {
          state: "viewing",
          body: {
            success: false,
            error: {
              code: "INVALID_PLAN_STATUS",
              message: "Cannot accept plan in current status"
            }
          },
          sideEffects: ["Show error alert", "Reload plan to get current status"]
        }
      }
    },

    requestModifications: {
      method: "POST",
      endpoint: "/api/v1/training-plan/:planId/modification-request",
      authentication: "required",

      request: {
        body: {
          concerns: "array<string>",
          notes: "string (optional)",
          urgency: "'low' | 'medium' | 'high'"
        }
      },

      responses: {
        201: {
          state: "modification_requested",
          body: {
            success: true,
            data: {
              requestId: "UUID",
              status: "'pending'",
              createdAt: "date"
            }
          },
          sideEffects: [
            "Notify coach via email/push",
            "Show confirmation to player",
            "Plan status remains 'draft' until modified"
          ]
        }
      }
    },

    rejectPlan: {
      method: "PUT",
      endpoint: "/api/v1/training-plan/:planId/reject",
      authentication: "required",

      request: {
        body: {
          reason: "string (required)",
          willCreateNewIntake: "boolean"
        }
      },

      responses: {
        200: {
          state: "rejected",
          body: {
            success: true,
            data: {
              planId: "UUID",
              status: "'archived'",
              archivedAt: "date"
            }
          },
          sideEffects: [
            "Unlink plan from intake (allow regeneration)",
            "Notify coach",
            "Archive plan data (don't delete)",
            "Redirect to IntakeFormScreen"
          ]
        }
      }
    },

    exportPlan: {
      method: "GET",
      endpoint: "/api/v1/training-plan/:planId/export",
      authentication: "required",

      request: {
        query: {
          format: "'pdf' | 'ics' | 'json'",
          includeExercises: "boolean"
        }
      },

      responses: {
        200: {
          state: "viewing (no state change)",
          contentType: "application/pdf | text/calendar | application/json",
          sideEffects: [
            "Download file to user's device",
            "Show success feedback: 'Plan exported successfully'",
            "Log export event for analytics"
          ]
        }
      }
    }
  },

  /**
   * DATA VISUALIZATION REQUIREMENTS
   */
  visualizations: {
    timeline: {
      type: "horizontal scrollable timeline",
      x_axis: "weeks (1-52)",
      segments: "periods (E/G/S/T) with different colors",
      markers: "tournaments (A/B/C importance levels)",
      interaction: "click week → jump to weekly view"
    },

    weeklyHoursChart: {
      type: "area chart",
      x_axis: "weeks (1-52)",
      y_axis: "hours (0-25)",
      data: "weeklyHours from periodizations",
      highlight: "current week",
      interaction: "hover → show exact hours + period"
    },

    periodBreakdown: {
      type: "stacked bar or pie chart",
      data: {
        E: "count of E weeks",
        G: "count of G weeks",
        S: "count of S weeks",
        T: "count of T weeks"
      },
      colors: "distinct, accessible colors (not iOS-like)"
    },

    calendarGrid: {
      type: "month view calendar",
      cells: "daily sessions with color coding by period",
      restDays: "visually distinct (not just color)",
      currentDay: "highlighted",
      interaction: "click day → view session details"
    }
  },

  /**
   * INTERACTION PATTERNS
   */
  interactions: {
    navigation: {
      weekSelector: {
        type: "dropdown | slider",
        range: "1-52",
        label: "Week {number} ({startDate} - {endDate})",
        shortcuts: ["Current Week", "Week 1", "Next Tournament"]
      },

      viewModeSwitcher: {
        type: "segmented control | tabs",
        options: ["Overview", "Calendar", "Weekly", "Periodization", "Tournaments"],
        persistence: "remember user's preference"
      }
    },

    sessionDetails: {
      trigger: "click on day in calendar | list item in weekly view",
      presentation: "modal | side panel",
      content: {
        sessionType: "string (large, bold)",
        duration: "number (minutes)",
        period: "'E' | 'G' | 'S' | 'T' (with explanation)",
        learningPhase: "'L1' → 'L5' (with description)",
        setting: "'S1' → 'S10' (range vs on-course)",
        exercises: "list of exercises from session template",
        equipment: "required equipment",
        goals: "what this session aims to achieve",
        instructions: "how to perform the session"
      },
      actions: ["Close", "Mark as Favorite", "Add Note", "Swap Session"]
    },

    acceptanceFlow: {
      trigger: "user clicks 'Accept Plan'",
      confirmation: {
        title: "Accept Training Plan?",
        message: "This 12-month plan will become your active training schedule. You can request modifications later if needed.",
        actions: [
          { label: "Accept", style: "primary", action: "acceptPlan()" },
          { label: "Request Changes", style: "secondary", action: "openModificationDialog()" },
          { label: "Cancel", style: "tertiary", action: "closeDialog()" }
        ]
      }
    },

    modificationRequest: {
      form: {
        fields: {
          concerns: {
            type: "multi-select checkboxes",
            options: [
              "Too many hours per week",
              "Conflicts with tournaments",
              "Not enough rest days",
              "Wrong focus areas",
              "Other (specify)"
            ]
          },
          notes: {
            type: "textarea",
            placeholder: "Describe what you'd like changed...",
            maxLength: 500
          },
          urgency: {
            type: "radio buttons",
            options: ["Low", "Medium", "High"],
            default: "Medium"
          }
        },
        validation: {
          concerns: "at least 1 selected OR notes provided",
          notes: "required if 'Other' is selected in concerns"
        }
      }
    }
  },

  /**
   * NAVIGATION RULES
   */
  navigation: {
    entry: {
      from: ["IntakeFormScreen (after plan generation)", "Dashboard", "PlayerProfile"],
      entryData: "planId (UUID)"
    },

    exit: {
      to: {
        onAccepted: "DashboardScreen",
        onRejected: "IntakeFormScreen",
        onModificationRequested: "DashboardScreen",
        onAbort: "previous_screen"
      },

      confirmationRequired: {
        when: "viewing_session_details === true",
        message: "none (just close modal)"
      }
    }
  },

  /**
   * ACCESSIBILITY REQUIREMENTS
   */
  accessibility: {
    keyboardNavigation: {
      required: true,
      shortcuts: [
        "Arrow keys: Navigate calendar days or week selector",
        "Enter: Open selected session details",
        "Escape: Close modal/cancel",
        "Tab: Navigate between view modes and actions"
      ]
    },

    screenReader: {
      announcements: [
        "Plan loaded: '{planName}' for {playerName}",
        "View mode changed to {mode}",
        "Week {number}: {weeklyHours} hours, period {period}",
        "Session details: {sessionType}, {duration} minutes",
        "Plan accepted successfully"
      ],
      chartDescriptions: "All charts must have text alternatives describing data"
    },

    visualizations: {
      colorBlindSafe: true,
      usePatterns: "periods should use patterns + colors",
      textAlternatives: "all data available in table format"
    }
  },

  /**
   * PERFORMANCE REQUIREMENTS
   */
  performance: {
    initialLoad: {
      target: "< 2 seconds to show overview",
      strategy: "Load essential data first, lazy load session details"
    },

    visualization: {
      rendering: "< 500ms for any view mode switch",
      lazyLoad: "session details only loaded when clicked"
    },

    caching: {
      planData: "Cache in memory for session duration",
      viewModeState: "Persist to localStorage"
    }
  },

  /**
   * ERROR TAXONOMY
   */
  errorTaxonomy: {
    notFound: {
      classification: "Plan doesn't exist or access denied",
      presentation: "Full-screen error with 'Return to Dashboard'",
      blocking: true,
      recovery: "Return to dashboard, check if intake exists"
    },

    unauthorized: {
      classification: "User doesn't own this plan",
      presentation: "Same as notFound (don't reveal existence)",
      blocking: true,
      recovery: "403 → show generic 'not found' message"
    },

    invalidStatus: {
      classification: "Plan is in wrong status for action",
      presentation: "Alert with explanation",
      blocking: false,
      examples: [
        "Cannot accept an already active plan",
        "Cannot modify an archived plan"
      ],
      recovery: "Reload plan to get current status, disable invalid actions"
    },

    system: {
      classification: "Server error or network failure",
      presentation: "Error state with retry",
      blocking: true,
      recovery: "Retry with exponential backoff, preserve planId"
    }
  }
} as const;

/**
 * TYPE EXPORTS
 */
export type PlanViewMode = keyof typeof PlanGenerationContract.viewModes;
export type PlanState = keyof typeof PlanGenerationContract.states;
export type PlanAction = string;
