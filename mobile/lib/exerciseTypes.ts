export type ExerciseType = 'mcq' | 'translate' | 'order' | 'listen' | 'fill'

export interface BaseExercise {
  id: string
  type: ExerciseType
  prompt?: string
}

export interface MCQExercise extends BaseExercise {
  options: string[]
  correctIndex?: number
  correctAnswer?: string
}

export interface TranslateExercise extends BaseExercise {
  source: string
  target?: string
  correctAnswer?: string
}

export interface OrderExercise extends BaseExercise {
  words: string[]
  correctOrder?: string[]
}

export interface ListeningExercise extends BaseExercise {
  audioUrl?: string
  prompt?: string
  correctAnswer?: string
}

export interface FillExercise extends BaseExercise {
  textWithBlanks: string
  blanksCount?: number
  correctAnswers?: string[]
}

export type Exercise = MCQExercise | TranslateExercise | OrderExercise | ListeningExercise | FillExercise
