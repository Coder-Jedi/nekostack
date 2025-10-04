// Onboarding type definitions

export interface OnboardingStep {
  id: string
  title: string
  content: string
  target: string // CSS selector for the element to highlight
  position: OnboardingPosition
  action?: OnboardingAction
  isOptional?: boolean
  showSkip?: boolean
}

export enum OnboardingPosition {
  TOP = 'top',
  BOTTOM = 'bottom',
  LEFT = 'left',
  RIGHT = 'right',
  CENTER = 'center'
}

export interface OnboardingAction {
  type: OnboardingActionType
  label: string
  url?: string
  callback?: () => void
}

export enum OnboardingActionType {
  NAVIGATE = 'navigate',
  CALLBACK = 'callback',
  HIGHLIGHT = 'highlight',
  NONE = 'none'
}

export interface OnboardingTour {
  id: string
  name: string
  description: string
  steps: OnboardingStep[]
  isActive: boolean
  targetAudience: OnboardingAudience
  triggers: OnboardingTrigger[]
}

export enum OnboardingAudience {
  NEW_USERS = 'new_users',
  FREE_USERS = 'free_users',
  PRO_USERS = 'pro_users',
  ALL_USERS = 'all_users',
  RETURNING_USERS = 'returning_users'
}

export interface OnboardingTrigger {
  type: OnboardingTriggerType
  condition?: string
  delay?: number
}

export enum OnboardingTriggerType {
  PAGE_LOAD = 'page_load',
  FIRST_VISIT = 'first_visit',
  FEATURE_DISCOVERY = 'feature_discovery',
  USER_ACTION = 'user_action',
  TIME_BASED = 'time_based'
}

export interface OnboardingProgress {
  tourId: string
  userId: string
  currentStep: number
  completedSteps: string[]
  isCompleted: boolean
  isSkipped: boolean
  startedAt: Date
  completedAt?: Date
  lastInteractionAt: Date
}

export interface OnboardingState {
  activeTour: OnboardingTour | null
  currentStep: number
  isVisible: boolean
  progress: OnboardingProgress | null
}
