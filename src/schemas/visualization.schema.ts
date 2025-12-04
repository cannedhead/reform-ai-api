import { z } from 'zod';

// Esquema para StylePreset
export const stylePresetSchema = z.object({
    name: z.string().min(1, 'El nombre del preset es requerido'),
    imageUrl: z.string().url('La URL de la imagen debe ser válida'),
});

// Esquema para validar los datos del FormData
export const generateVisualizationSchema = z.object({
    roomType: z.string().min(1, 'El tipo de habitación es requerido'),
    textPrompt: z.string().optional(),
    styleInfluence: z.number()
        .min(0, 'La influencia del estilo debe ser minimo 0'),
    isRefinement: z.boolean().optional().default(false),
    stylePreset: stylePresetSchema,
});

// Tipos inferidos de los schemas
export type StylePresetInput = z.infer<typeof stylePresetSchema>;
export type GenerateVisualizationInput = z.infer<typeof generateVisualizationSchema>;
