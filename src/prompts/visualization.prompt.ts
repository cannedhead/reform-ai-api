import {
    MAIN_PROMPT_ROOM_REDESIGN,
    MAIN_PROMPT_IMAGE_REFINEMENT,
    INFLUENCE_PRIORITIZE_PRESET_STYLE,
    INFLUENCE_PRIORITIZE_MOOD_BOARD,
    INFLUENCE_BALANCE_STYLE_AND_MOOD_BOARD,
    INFLUENCE_PRESET_STYLE_ONLY,
    INSTRUCTION_INTEGRATE_FURNITURE,
    DEFAULT_USER_REQUEST,
} from './visualization.constants.js';

export interface VisualizationPromptParams {
    isRefinement: boolean;
    roomType: string;
    stylePresetName: string;
    influencePrompt: string;
    textPrompt: string;
    furniturePrompt: string;
}

export const buildVisualizationPrompt = (params: VisualizationPromptParams): string => {
    const {
        isRefinement,
        roomType,
        stylePresetName,
        influencePrompt,
        textPrompt,
        furniturePrompt,
    } = params;

    const template = isRefinement ? MAIN_PROMPT_IMAGE_REFINEMENT : MAIN_PROMPT_ROOM_REDESIGN;

    return template
        .replace(/\{\{ROOM_TYPE\}\}/g, roomType)
        .replace(/\{\{STYLE_NAME\}\}/g, stylePresetName)
        .replace(/\{\{INFLUENCE_INSTRUCTION\}\}/g, influencePrompt)
        .replace(/\{\{USER_REQUEST\}\}/g, textPrompt || DEFAULT_USER_REQUEST)
        .replace(/\{\{FURNITURE_INSTRUCTION\}\}/g, furniturePrompt);
};

export const buildInfluencePrompt = (
    moodBoardImagesCount: number,
    styleInfluence: number,
    stylePresetName: string
): string => {
    if (moodBoardImagesCount > 0) {
        if (styleInfluence < 33) {
            return INFLUENCE_PRIORITIZE_PRESET_STYLE.replace(/\{\{STYLE_NAME\}\}/g, stylePresetName);
        } else if (styleInfluence > 66) {
            return INFLUENCE_PRIORITIZE_MOOD_BOARD;
        } else {
            return INFLUENCE_BALANCE_STYLE_AND_MOOD_BOARD.replace(/\{\{STYLE_NAME\}\}/g, stylePresetName);
        }
    }
    return INFLUENCE_PRESET_STYLE_ONLY;
};

export const buildFurniturePrompt = (hasFurnitureImage: boolean, roomType: string): string => {
    if (!hasFurnitureImage) {
        return '';
    }

    return INSTRUCTION_INTEGRATE_FURNITURE.replace(/\{\{ROOM_TYPE\}\}/g, roomType);
};
