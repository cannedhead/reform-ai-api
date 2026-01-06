// ============================================
// VISUALIZATION PROMPTS - REFORMAI
// ============================================
// This file contains all the prompts used to generate
// interior design visualizations.
// 
// EDITING INSTRUCTIONS:
// - You can freely modify the text of each prompt
// - Values between {{DOUBLE_BRACKETS}} will be replaced automatically
// - Do not delete the {{VARIABLES}}, just modify the text around them
// ============================================


// --------------------------------------------
// MAIN PROMPT - ROOM REDESIGN
// --------------------------------------------
// Used when the user wants to redesign a room from scratch
export const MAIN_PROMPT_ROOM_REDESIGN = `
Act as an expert interior designer. Redesign the provided room image.

**Primary Instructions:**
- Room Type: {{ROOM_TYPE}}
- Aesthetic Style: {{STYLE_NAME}}
- Style Influence: {{INFLUENCE_INSTRUCTION}}
- User's specific requests: "{{USER_REQUEST}}"
{{FURNITURE_INSTRUCTION}}

**Design Constraints:**
1.  The final image MUST be a photorealistic rendering.
2.  Do NOT change the room's core structure, such as walls, windows, or doors position.
3.  Mantain the amount of windows.
4.  Focus on changing materials (flooring, walls), furniture, lighting, and decor to match the requested style.
5.  Maintain the original room's geometry and proportions.
6.  Mantain the picture perspective

Generate the redesigned room image.
`;


// --------------------------------------------
// MAIN PROMPT - IMAGE REFINEMENT
// --------------------------------------------
// Used when the user wants to adjust an already generated image
export const MAIN_PROMPT_IMAGE_REFINEMENT = `
Act as an expert interior designer. Refine the provided image based on the user request.

**Primary Instructions:**
- Room Type: {{ROOM_TYPE}}
- Aesthetic Style: {{STYLE_NAME}}
- Style Influence: {{INFLUENCE_INSTRUCTION}}
- User's specific requests: "{{USER_REQUEST}}"
{{FURNITURE_INSTRUCTION}}

**Design Constraints:**
1.  The final image MUST be a photorealistic rendering.
2.  Do NOT change the room's core structure, such as walls, windows, or doors position.
3.  Mantain the amount of windows.
4.  Apply the requested changes to the image.
5.  Maintain the original room's geometry and proportions.
6.  Mantain the picture perspective

Generate the refined room image.
`;


// --------------------------------------------
// STYLE INFLUENCE - MOOD BOARD
// --------------------------------------------
// These prompts determine how much weight to give the mood board vs the preset style

// When user prefers the preset style (slider low, less than 33%)
export const INFLUENCE_PRIORITIZE_PRESET_STYLE = `Heavily prioritize the preset style ({{STYLE_NAME}}) over the mood board images.`;

// When user prefers the mood board images (slider high, more than 66%)
export const INFLUENCE_PRIORITIZE_MOOD_BOARD = `Heavily prioritize the provided mood board images for style inspiration over the preset style.`;

// When user wants a balance between both (slider middle, between 33% and 66%)
export const INFLUENCE_BALANCE_STYLE_AND_MOOD_BOARD = `Blend the preset style ({{STYLE_NAME}}) and the mood board images evenly.`;

// When there is no mood board, only use preset style
export const INFLUENCE_PRESET_STYLE_ONLY = `Use the preset style as the primary design guide.`;


// --------------------------------------------
// SPECIFIC FURNITURE INTEGRATION
// --------------------------------------------
// Used when the user uploads an image of a furniture piece they want to include
export const INSTRUCTION_INTEGRATE_FURNITURE = `
**Furniture Integration:**
- An image of a specific piece of furniture has been provided. You MUST incorporate this exact piece of furniture into the final design.
- **Crucial Placement Instructions:**
    1.  **Analyze Layout:** First, analyze the original room's layout, perspective, and existing furniture arrangement.
    2.  **Natural Placement:** Place the new furniture in a functionally appropriate and aesthetically pleasing position within the {{ROOM_TYPE}}. For example, a sofa should be against a wall or defining a seating area, not floating awkwardly in a corner.
    3.  **Correct Scale & Perspective:** The furniture MUST be scaled to realistic proportions relative to the room and other objects. Its perspective must perfectly align with the room's vanishing points.
    4.  **Seamless Integration:** The final result should be photorealistic and look like a single, cohesive photograph. The furniture should not look like it was digitally added.
    5.  **Lighting and Shadows:** Meticulously match the lighting on the new furniture to the room's existing light sources. It must cast accurate and soft shadows on the floor and surrounding objects to ground it in the scene.
`;


// --------------------------------------------
// DEFAULT VALUE
// --------------------------------------------
// Used when the user does not write any specific request
export const DEFAULT_USER_REQUEST = `No specific requests.`;
