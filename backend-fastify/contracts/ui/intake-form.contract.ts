/**
 * UI CONTRACT: Player Intake Form
 *
 * This contract defines the deterministic behavior of the player intake form.
 * Frontend and backend MUST both conform to this specification.
 *
 * Philosophy: Behavior first, visuals later.
 * If implementation and contract disagree, the contract wins.
 */

export const IntakeFormContract = {
  /**
   * SCREEN IDENTITY
   */
  screen: "PlayerIntakeForm",
  version: "1.0.0",
  primaryGoal: "Collect comprehensive player data to generate personalized 12-month training plan",

  /**
   * ROLES & PERMISSIONS
   */
  allowedRoles: ["player", "coach"],
  roleCapabilities: {
    player: ["fill_own_form", "save_progress", "submit", "view_own_intake"],
    coach: ["fill_player_form", "save_progress", "submit", "view_all_intakes", "edit_existing"]
  },

  /**
   * REQUIRED CONTEXT
   * Data that must be available before screen can render
   */
  requiredContext: {
    playerId: {
      type: "UUID",
      source: "auth_session | route_param",
      validation: "Must be valid UUID, player must exist in tenant"
    },
    tenantId: {
      type: "UUID",
      source: "auth_session",
      validation: "Must match authenticated user's tenant"
    }
  },

  /**
   * FORM STRUCTURE
   * 8 sections: 5 required, 3 optional
   */
  formSections: {
    background: {
      required: true,
      fields: {
        yearsPlaying: { type: "number", min: 0, max: 100 },
        currentHandicap: { type: "number", min: -5, max: 54 },
        averageScore: { type: "number", min: 60, max: 150 },
        roundsPerYear: { type: "number", min: 0, max: 200 },
        trainingHistory: {
          type: "enum",
          values: ["none", "sporadic", "regular", "systematic"]
        }
      }
    },
    availability: {
      required: true,
      fields: {
        hoursPerWeek: { type: "number", min: 1, max: 40 },
        preferredDays: { type: "array<number>", items: { min: 0, max: 6 } },
        canTravelToFacility: { type: "boolean" },
        hasHomeEquipment: { type: "boolean" },
        seasonalAvailability: {
          type: "object",
          optional: true,
          fields: {
            summer: { type: "number", min: 1, max: 40 },
            winter: { type: "number", min: 1, max: 40 }
          }
        }
      }
    },
    goals: {
      required: true,
      fields: {
        primaryGoal: {
          type: "enum",
          values: ["lower_handicap", "compete_tournaments", "consistency", "enjoy_more", "specific_skill"]
        },
        targetHandicap: { type: "number", min: -5, max: 54, optional: true },
        targetScore: { type: "number", min: 60, max: 150, optional: true },
        timeframe: { type: "enum", values: ["3_months", "6_months", "12_months"] },
        tournaments: {
          type: "array<object>",
          optional: true,
          itemSchema: {
            name: { type: "string", maxLength: 255 },
            date: { type: "date", futureOnly: true },
            importance: { type: "enum", values: ["major", "important", "minor"] },
            targetPlacement: { type: "string", optional: true }
          }
        },
        specificFocus: { type: "array<string>", optional: true }
      }
    },
    weaknesses: {
      required: true,
      fields: {
        biggestFrustration: { type: "string", minLength: 10, maxLength: 500 },
        problemAreas: {
          type: "array<string>",
          minItems: 1,
          allowedValues: [
            "driver_distance", "driver_accuracy", "iron_consistency",
            "approach_shots", "short_game", "putting_distance",
            "putting_direction", "bunker_play", "course_management", "mental_game"
          ]
        },
        mentalChallenges: {
          type: "array<string>",
          optional: true,
          allowedValues: [
            "pressure_situations", "focus_consistency", "confidence",
            "anger_management", "pre_shot_routine", "course_strategy"
          ]
        },
        physicalLimitations: {
          type: "array<object>",
          optional: true,
          itemSchema: {
            area: { type: "enum", values: ["back", "shoulder", "wrist", "hip", "knee", "elbow"] },
            severity: { type: "enum", values: ["mild", "moderate", "significant"] },
            affectsSwing: { type: "boolean" }
          }
        }
      }
    },
    health: {
      required: true,
      fields: {
        currentInjuries: {
          type: "array<object>",
          itemSchema: {
            type: { type: "string", maxLength: 255 },
            dateOccurred: { type: "date", optional: true },
            resolved: { type: "boolean" },
            requiresModification: { type: "boolean" },
            affectedAreas: { type: "array<string>" }
          }
        },
        injuryHistory: { type: "array<object>", schema: "same as currentInjuries" },
        chronicConditions: { type: "array<string>", optional: true },
        mobilityIssues: { type: "array<string>", optional: true },
        ageGroup: {
          type: "enum",
          values: ["<25", "25-35", "35-45", "45-55", "55-65", "65+"]
        }
      }
    },
    lifestyle: {
      required: false,
      fields: {
        workSchedule: {
          type: "enum",
          values: ["flexible", "regular_hours", "irregular", "shift_work"]
        },
        stressLevel: { type: "number", min: 1, max: 5 },
        sleepQuality: { type: "number", min: 1, max: 5 },
        nutritionFocus: { type: "boolean" },
        physicalActivity: {
          type: "enum",
          values: ["sedentary", "light", "moderate", "active"]
        }
      }
    },
    equipment: {
      required: false,
      fields: {
        hasDriverSpeedMeasurement: { type: "boolean" },
        driverSpeed: { type: "number", min: 40, max: 150, optional: true },
        recentClubFitting: { type: "boolean" },
        accessToTrackMan: { type: "boolean" },
        accessToGym: { type: "boolean" },
        willingToInvest: { type: "enum", values: ["minimal", "moderate", "significant"] }
      }
    },
    learning: {
      required: false,
      fields: {
        preferredStyle: { type: "enum", values: ["visual", "verbal", "kinesthetic", "mixed"] },
        wantsDetailedExplanations: { type: "boolean" },
        prefersStructure: { type: "boolean" },
        motivationType: {
          type: "enum",
          values: ["competition", "personal_growth", "social", "achievement"]
        }
      }
    }
  },

  /**
   * STATE MACHINE
   * All possible states and valid transitions
   */
  states: {
    idle: {
      description: "Initial state, form ready for input",
      allowedActions: ["fill_section", "load_existing", "abort"],
      canNavigateAway: true,
      dataValidation: "none"
    },

    editing: {
      description: "User is actively filling out form sections",
      allowedActions: ["fill_section", "save_progress", "submit_for_completion_check", "abort"],
      canNavigateAway: false, // Must confirm if unsaved changes
      dataValidation: "field-level"
    },

    saving: {
      description: "POST /api/v1/intake in progress",
      allowedActions: [], // All inputs disabled
      canNavigateAway: false,
      apiCall: "POST /api/v1/intake",
      timeout: 10000, // 10 second timeout
      onTimeout: "transition to error_system with retry"
    },

    saved: {
      description: "Data persisted successfully, showing completion percentage",
      allowedActions: ["continue_editing", "generate_plan", "view_summary", "exit"],
      canNavigateAway: true,
      displayData: {
        completionPercentage: "number (0-100)",
        isComplete: "boolean",
        missingRequired: "array<string> (section names)"
      }
    },

    generating_plan: {
      description: "POST /api/v1/intake/:id/generate-plan in progress",
      allowedActions: [], // All inputs disabled
      canNavigateAway: false,
      apiCall: "POST /api/v1/intake/:intakeId/generate-plan",
      preconditions: ["isComplete === true"],
      timeout: 30000, // 30 second timeout (plan generation is expensive)
      onTimeout: "transition to error_system with retry"
    },

    plan_generated: {
      description: "Training plan created successfully",
      allowedActions: ["view_plan", "return_to_intake", "exit_to_dashboard"],
      canNavigateAway: true,
      displayData: {
        planId: "UUID",
        planName: "string",
        weeklyHoursTarget: "number",
        startDate: "date",
        totalWeeks: "number"
      },
      autoNavigation: {
        delay: 3000, // 3 seconds
        destination: "PlanPreviewScreen",
        userCanCancel: true
      }
    },

    loading_existing: {
      description: "GET /api/v1/intake/player/:playerId in progress",
      allowedActions: [],
      canNavigateAway: false,
      apiCall: "GET /api/v1/intake/player/:playerId",
      timeout: 5000
    },

    error_validation: {
      description: "User-correctable validation errors",
      allowedActions: ["fix_fields", "abort"],
      canNavigateAway: true,
      displayData: {
        fieldErrors: "Record<sectionName, Record<fieldName, string>>",
        missingRequired: "array<string>"
      },
      errorPresentation: "inline", // Show errors next to fields
      preserveData: true
    },

    error_domain: {
      description: "Business rule violation (e.g., player not found, already has plan)",
      allowedActions: ["retry", "abort"],
      canNavigateAway: true,
      displayData: {
        errorCode: "string",
        errorMessage: "string",
        suggestedAction: "string"
      },
      errorPresentation: "modal", // Show as alert/modal
      preserveData: true
    },

    error_system: {
      description: "Infrastructure failure (500, network error, timeout)",
      allowedActions: ["retry", "save_local", "abort"],
      canNavigateAway: true,
      displayData: {
        errorType: "string (server_error | network_error | timeout)",
        timestamp: "date",
        retryCount: "number"
      },
      errorPresentation: "prominent", // Full-screen error state
      preserveData: true,
      localBackup: true // Save to localStorage
    },

    aborted: {
      description: "User cancelled operation",
      allowedActions: [],
      canNavigateAway: true,
      onEnter: "clear unsaved data",
      autoNavigation: {
        immediate: true,
        destination: "previous_screen"
      }
    }
  },

  /**
   * STATE TRANSITIONS
   * Valid state transitions and their triggers
   */
  transitions: {
    "idle → editing": {
      trigger: "user starts filling form",
      validation: "none"
    },
    "idle → loading_existing": {
      trigger: "playerId provided and intake exists",
      validation: "playerId is valid UUID"
    },
    "editing → saving": {
      trigger: "user clicks 'Save Progress' or auto-save timer",
      validation: "at least one section has data"
    },
    "saving → saved": {
      trigger: "API returns 200",
      payload: "{ id, completionPercentage, isComplete }"
    },
    "saving → error_validation": {
      trigger: "API returns 400",
      payload: "{ code, message, fieldErrors }"
    },
    "saving → error_domain": {
      trigger: "API returns 404",
      payload: "{ code: 'PLAYER_NOT_FOUND', message }"
    },
    "saving → error_system": {
      trigger: "API returns 500 | timeout | network error",
      payload: "{ errorType, message }"
    },
    "saved → editing": {
      trigger: "user clicks 'Continue Editing'",
      validation: "none"
    },
    "saved → generating_plan": {
      trigger: "user clicks 'Generate Plan'",
      validation: "isComplete === true",
      onValidationFail: "show error: 'Please complete all required sections'"
    },
    "generating_plan → plan_generated": {
      trigger: "API returns 201",
      payload: "{ annualPlan, periodizations, dailyAssignments, tournaments }"
    },
    "generating_plan → error_domain": {
      trigger: "API returns 400",
      payload: "{ code: 'INCOMPLETE_INTAKE', message }"
    },
    "generating_plan → error_system": {
      trigger: "API returns 500 | timeout",
      payload: "{ errorType, message }"
    },
    "loading_existing → editing": {
      trigger: "API returns 200",
      payload: "existing intake data"
    },
    "loading_existing → idle": {
      trigger: "API returns 404 (no existing intake)",
      validation: "none"
    },
    "error_* → editing": {
      trigger: "user clicks 'Retry' or 'Fix'",
      validation: "preserved data is restored"
    },
    "* → aborted": {
      trigger: "user clicks 'Cancel' or 'Back'",
      validation: "confirm if unsaved changes exist"
    }
  },

  /**
   * API BINDINGS
   * OpenAPI endpoint mappings with explicit semantics
   */
  apiBindings: {
    saveProgress: {
      method: "POST",
      endpoint: "/api/v1/intake",
      authentication: "required (Bearer token)",
      contentType: "application/json",

      request: {
        body: {
          playerId: "UUID",
          background: "object | undefined",
          availability: "object | undefined",
          goals: "object | undefined",
          weaknesses: "object | undefined",
          health: "object | undefined",
          lifestyle: "object | undefined",
          equipment: "object | undefined",
          learning: "object | undefined"
        }
      },

      responses: {
        200: {
          state: "saved",
          body: {
            success: true,
            data: {
              id: "UUID",
              completionPercentage: "number (0-100)",
              isComplete: "boolean"
            }
          },
          sideEffects: [
            "Update completionPercentage display",
            "If isComplete=true, enable 'Generate Plan' button",
            "Show success feedback (subtle, non-intrusive)"
          ]
        },

        400: {
          state: "error_validation",
          body: {
            success: false,
            error: {
              code: "VALIDATION_ERROR",
              message: "string",
              details: {
                fieldErrors: "object"
              }
            }
          },
          sideEffects: [
            "Highlight invalid fields",
            "Show inline error messages",
            "Keep form editable",
            "Preserve user input"
          ]
        },

        401: {
          state: "error_domain",
          sideEffects: [
            "Clear auth token",
            "Save form data to localStorage",
            "Redirect to login",
            "After login, restore form data"
          ]
        },

        404: {
          state: "error_domain",
          body: {
            success: false,
            error: {
              code: "PLAYER_NOT_FOUND",
              message: "Player not found"
            }
          },
          sideEffects: [
            "Disable form",
            "Show error message",
            "Offer 'Return to Dashboard' action"
          ]
        },

        500: {
          state: "error_system",
          body: {
            success: false,
            error: {
              code: "INTERNAL_SERVER_ERROR",
              message: "string"
            }
          },
          sideEffects: [
            "Preserve all form data",
            "Show retry button",
            "Save to localStorage as backup",
            "Log error for debugging"
          ]
        }
      },

      errorHandling: {
        networkError: {
          state: "error_system",
          retryStrategy: "exponential backoff (1s, 2s, 4s)",
          maxRetries: 3
        },
        timeout: {
          state: "error_system",
          timeoutDuration: 10000,
          fallback: "save to localStorage"
        }
      }
    },

    generatePlan: {
      method: "POST",
      endpoint: "/api/v1/intake/:intakeId/generate-plan",
      authentication: "required (Bearer token)",

      preconditions: {
        isComplete: {
          check: "completionPercentage === 100",
          onFail: "show error: 'Please complete all required sections before generating plan'"
        },
        notAlreadyGenerated: {
          check: "generatedPlanId === null",
          onFail: "show confirmation: 'This will replace your existing plan. Continue?'"
        }
      },

      request: {
        params: {
          intakeId: "UUID from saved state"
        }
      },

      responses: {
        201: {
          state: "plan_generated",
          body: {
            success: true,
            data: {
              annualPlan: "object (id, planName, startDate, etc.)",
              periodizations: "array<object>",
              dailyAssignments: "array<object>",
              tournaments: "array<object>"
            }
          },
          sideEffects: [
            "Show success message: 'Your personalized training plan is ready!'",
            "Update intake record with generatedPlanId",
            "Navigate to PlanPreviewScreen after 3s (cancelable)"
          ]
        },

        400: {
          state: "error_domain",
          body: {
            success: false,
            error: {
              code: "INCOMPLETE_INTAKE",
              message: "Intake form is not complete"
            }
          },
          sideEffects: [
            "Show missing sections",
            "Highlight incomplete sections in UI",
            "Offer 'Complete Form' action"
          ]
        },

        404: {
          state: "error_domain",
          body: {
            success: false,
            error: {
              code: "INTAKE_NOT_FOUND",
              message: "Intake form not found"
            }
          },
          sideEffects: [
            "This shouldn't happen (data inconsistency)",
            "Log error",
            "Offer 'Return to Dashboard' action"
          ]
        },

        500: {
          state: "error_system",
          sideEffects: [
            "Show retry button",
            "Preserve intake data",
            "Log error with intakeId for debugging"
          ]
        }
      },

      errorHandling: {
        timeout: {
          timeoutDuration: 30000, // Plan generation is expensive
          fallback: "Show 'This is taking longer than expected. You can wait or we'll notify you when ready.'"
        }
      }
    },

    loadExisting: {
      method: "GET",
      endpoint: "/api/v1/intake/player/:playerId",
      authentication: "required (Bearer token)",

      request: {
        params: {
          playerId: "UUID from auth session or route"
        }
      },

      responses: {
        200: {
          state: "editing (with prefilled data)",
          body: {
            success: true,
            data: {
              id: "UUID",
              playerId: "UUID",
              completionPercentage: "number",
              isComplete: "boolean",
              background: "object | null",
              availability: "object | null",
              goals: "object | null",
              weaknesses: "object | null",
              health: "object | null",
              lifestyle: "object | null",
              equipment: "object | null",
              learning: "object | null",
              submittedAt: "date"
            }
          },
          sideEffects: [
            "Populate form fields with existing data",
            "Show completionPercentage",
            "Show 'Last saved: {timestamp}'",
            "If isComplete=true, show 'Generate Plan' button"
          ]
        },

        404: {
          state: "idle",
          sideEffects: [
            "No existing intake found",
            "Show empty form",
            "This is normal for first-time intake"
          ]
        }
      }
    },

    deleteIntake: {
      method: "DELETE",
      endpoint: "/api/v1/intake/:intakeId",
      authentication: "required (Bearer token)",

      preconditions: {
        confirmation: {
          check: "user confirmed deletion",
          message: "Are you sure? This will delete all intake data and cannot be undone."
        }
      },

      responses: {
        200: {
          state: "aborted",
          sideEffects: [
            "Clear form data",
            "Show success message",
            "Navigate to dashboard"
          ]
        }
      }
    }
  },

  /**
   * NAVIGATION RULES
   * When and how to navigate between screens
   */
  navigation: {
    entry: {
      from: ["Dashboard", "PlayerProfile"],
      entryAction: "Check for existing intake → load if exists, else show empty form"
    },

    exit: {
      to: {
        onPlanGenerated: "PlanPreviewScreen",
        onAbort: "previous_screen (Dashboard or PlayerProfile)",
        onSessionTimeout: "LoginScreen"
      },

      confirmationRequired: {
        when: "state === 'editing' AND hasUnsavedChanges === true",
        message: "You have unsaved changes. Save before leaving?",
        options: [
          { label: "Save & Exit", action: "save → navigate" },
          { label: "Discard", action: "clear → navigate" },
          { label: "Cancel", action: "stay" }
        ]
      }
    },

    browserBackButton: {
      behavior: "same as confirmationRequired",
      preventDefault: "if editing with unsaved changes"
    }
  },

  /**
   * ERROR TAXONOMY
   * Classification and handling of all error types
   */
  errorTaxonomy: {
    validation: {
      classification: "User can fix immediately",
      presentation: "Inline near affected field",
      blocking: false,
      examples: [
        "Invalid email format",
        "Handicap out of range (-5 to 54)",
        "Missing required field",
        "Date in the past (for tournaments)"
      ],
      recovery: "User edits field → validation re-runs → error clears"
    },

    domain: {
      classification: "Business rule violation",
      presentation: "Alert message with suggested action",
      blocking: true,
      examples: [
        "Player not found",
        "Player already has active intake",
        "Intake incomplete (when trying to generate plan)",
        "Unauthorized access (wrong tenant)"
      ],
      recovery: "User follows suggested action or contacts support"
    },

    system: {
      classification: "Infrastructure failure",
      presentation: "Full error state with retry",
      blocking: true,
      examples: [
        "500 Internal Server Error",
        "Network timeout",
        "Database unavailable",
        "API rate limit exceeded"
      ],
      recovery: [
        "Preserve all user data",
        "Offer retry with exponential backoff",
        "Save to localStorage as backup",
        "Show 'Try again later' if retries exhausted"
      ]
    }
  },

  /**
   * ACCESSIBILITY REQUIREMENTS
   * WCAG 2.1 AA compliance
   */
  accessibility: {
    keyboardNavigation: {
      required: true,
      implementation: [
        "Tab: Move to next field",
        "Shift+Tab: Move to previous field",
        "Enter: Submit current section",
        "Escape: Close modal/cancel action",
        "Arrow keys: Navigate within multi-select fields"
      ]
    },

    screenReader: {
      required: true,
      announcements: [
        "State transitions (saving, saved, error)",
        "Completion percentage changes",
        "Error messages (immediately when they appear)",
        "Success feedback",
        "Loading states"
      ],
      labels: "All form fields must have accessible labels (visible or aria-label)"
    },

    focusManagement: {
      onError: "Focus first invalid field",
      onStateChange: "Announce new state, don't move focus unless necessary",
      modalDialogs: "Trap focus within modal, restore on close"
    },

    colorContrast: {
      required: "4.5:1 for normal text, 3:1 for large text",
      errorStates: "Must not rely on color alone (use icons + text)"
    }
  },

  /**
   * PERFORMANCE REQUIREMENTS
   */
  performance: {
    autoSave: {
      enabled: true,
      strategy: "debounced",
      delay: 3000, // 3 seconds after last keystroke
      onlyIfChanged: true
    },

    fieldValidation: {
      timing: "on blur (not on every keystroke)",
      debounce: 500 // for async validations
    },

    apiResponseTime: {
      saveProgress: "< 2 seconds expected",
      generatePlan: "< 10 seconds expected (warn if longer)",
      loadExisting: "< 1 second expected"
    }
  },

  /**
   * DATA PERSISTENCE
   */
  dataPersistence: {
    localStorage: {
      enabled: true,
      purpose: "Backup for network failures and session timeout",
      key: "intake_backup_{playerId}",
      clearOn: ["successful save", "intentional abort", "plan generated"],
      restoreOn: ["page refresh", "return after session timeout"]
    },

    serverSide: {
      progressive: true, // Can save incomplete forms
      versioning: false, // Only keep latest version
      retention: "Until plan generated or manually deleted"
    }
  }
} as const;

/**
 * TYPE EXPORTS
 * TypeScript types derived from this contract
 */
export type IntakeFormState = keyof typeof IntakeFormContract.states;
export type IntakeFormAction = string; // Derived from allowedActions
export type IntakeFormSection = keyof typeof IntakeFormContract.formSections;
