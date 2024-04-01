import { MAX_DIFFICULTY_SCORE, NUM_OF_DIFFICULTY_LEVELS } from "./constants"

export const getDifficultyLevel = (difficultyScore: number) => {
    return Math.ceil(difficultyScore / (MAX_DIFFICULTY_SCORE / NUM_OF_DIFFICULTY_LEVELS))
}