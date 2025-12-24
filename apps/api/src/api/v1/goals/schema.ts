export const goalSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    userId: { type: 'string', format: 'uuid' },
    title: { type: 'string' },
    description: { type: 'string', nullable: true },
    goalType: { type: 'string' },
    timeframe: { type: 'string' },
    targetValue: { type: 'number', nullable: true },
    currentValue: { type: 'number', nullable: true },
    startValue: { type: 'number', nullable: true },
    unit: { type: 'string', nullable: true },
    progressPercent: { type: 'integer' },
    startDate: { type: 'string', format: 'date' },
    targetDate: { type: 'string', format: 'date' },
    completedDate: { type: 'string', format: 'date', nullable: true },
    status: { type: 'string' },
    icon: { type: 'string', nullable: true },
    color: { type: 'string', nullable: true },
    notes: { type: 'string', nullable: true },
    milestones: { type: 'array', items: { type: 'object' } },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' }
  },
  required: ['id', 'userId', 'title', 'goalType', 'timeframe', 'progressPercent', 'startDate', 'targetDate', 'status', 'createdAt', 'updatedAt']
};

export const createGoalSchema = {
  body: {
    type: 'object',
    properties: {
      title: { type: 'string', minLength: 1, maxLength: 255 },
      description: { type: 'string' },
      goalType: {
        type: 'string',
        enum: ['score', 'technique', 'physical', 'mental', 'competition', 'other'],
        maxLength: 50
      },
      timeframe: {
        type: 'string',
        enum: ['short', 'medium', 'long'],
        maxLength: 20
      },
      targetValue: { type: 'number' },
      currentValue: { type: 'number' },
      startValue: { type: 'number' },
      unit: { type: 'string', maxLength: 50 },
      startDate: { type: 'string', format: 'date' },
      targetDate: { type: 'string', format: 'date' },
      icon: { type: 'string', maxLength: 50 },
      color: { type: 'string', pattern: '^#[0-9A-Fa-f]{6}$' },
      notes: { type: 'string' },
      milestones: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            value: { type: 'number' },
            completed: { type: 'boolean' }
          }
        },
        maxItems: 20
      }
    },
    required: ['title', 'goalType', 'timeframe', 'startDate', 'targetDate']
  },
  response: {
    201: goalSchema
  }
};

export const updateGoalSchema = {
  params: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' }
    },
    required: ['id']
  },
  body: {
    type: 'object',
    properties: {
      title: { type: 'string', minLength: 1, maxLength: 255 },
      description: { type: 'string' },
      goalType: {
        type: 'string',
        enum: ['score', 'technique', 'physical', 'mental', 'competition', 'other'],
        maxLength: 50
      },
      timeframe: {
        type: 'string',
        enum: ['short', 'medium', 'long'],
        maxLength: 20
      },
      targetValue: { type: 'number' },
      currentValue: { type: 'number' },
      startValue: { type: 'number' },
      unit: { type: 'string', maxLength: 50 },
      progressPercent: { type: 'integer', minimum: 0, maximum: 100 },
      startDate: { type: 'string', format: 'date' },
      targetDate: { type: 'string', format: 'date' },
      completedDate: { type: 'string', format: 'date' },
      status: {
        type: 'string',
        enum: ['active', 'completed', 'paused', 'cancelled'],
        maxLength: 20
      },
      icon: { type: 'string', maxLength: 50 },
      color: { type: 'string', pattern: '^#[0-9A-Fa-f]{6}$' },
      notes: { type: 'string' },
      milestones: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            value: { type: 'number' },
            completed: { type: 'boolean' }
          }
        },
        maxItems: 20
      }
    }
  },
  response: {
    200: goalSchema
  }
};

export const getGoalSchema = {
  params: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' }
    },
    required: ['id']
  },
  response: {
    200: goalSchema
  }
};

export const listGoalsSchema = {
  querystring: {
    type: 'object',
    properties: {
      status: {
        type: 'string',
        enum: ['active', 'completed', 'paused', 'cancelled']
      },
      goalType: {
        type: 'string',
        enum: ['score', 'technique', 'physical', 'mental', 'competition', 'other']
      }
    }
  },
  response: {
    200: {
      type: 'array',
      items: goalSchema
    }
  }
};

export const deleteGoalSchema = {
  params: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' }
    },
    required: ['id']
  },
  response: {
    200: {
      type: 'object',
      properties: {
        success: { type: 'boolean' }
      }
    }
  }
};

export const updateProgressSchema = {
  params: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' }
    },
    required: ['id']
  },
  body: {
    type: 'object',
    properties: {
      currentValue: { type: 'number' }
    },
    required: ['currentValue']
  },
  response: {
    200: goalSchema
  }
};
