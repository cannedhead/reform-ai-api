import type { MultipartFile, Multipart } from '@fastify/multipart';
import {
    ValidationError,
    validateImageFile,
    validateImageFiles,
    parseNumber,
    parseBoolean,
    parseJSON,
} from '../utils/validation.utils.js';
import { generateVisualizationSchema, StylePresetInput } from '../schemas/visualization.schema.js';

/**
 * Interfaz para los datos procesados del FormData
 */
export interface ProcessedVisualizationData {
    roomImage: MultipartFile & { buffer: Buffer };
    roomType: string;
    stylePreset: StylePresetInput;
    moodBoardImages: (MultipartFile & { buffer: Buffer })[];
    furnitureImage?: MultipartFile & { buffer: Buffer };
    textPrompt: string;
    styleInfluence: number;
    isRefinement: boolean;
    // Previous generated image for refinement context
    previousResultImage?: MultipartFile & { buffer: Buffer };
}

/**
 * Procesa y valida los datos del FormData para la generación de visualización
 */
export async function processVisualizationFormData(
    parts: AsyncIterableIterator<Multipart>
): Promise<ProcessedVisualizationData> {
    const fields: Record<string, string | boolean> = {};
    const files: Record<string, MultipartFile | MultipartFile[]> = {};

    for await (const part of parts) {
        const fieldName = part.fieldname;

        if (part.type === 'file') {
            const buffer = await part.toBuffer();

            const fileWithBuffer = {
                ...part,
                buffer,
            };

            if (fieldName === 'moodBoardImages') {
                if (!files[fieldName]) {
                    files[fieldName] = [];
                }
                (files[fieldName] as MultipartFile[]).push(fileWithBuffer as any);
            } else {
                files[fieldName] = fileWithBuffer as any;
            }
        } else {
            if (part.value === 'true' || part.value === 'false') {
                fields[fieldName] = part.value === 'true';
            } else {
                fields[fieldName] = part.value as string;
            }
        }
    }

    // Validar que todos los campos requeridos estén presentes
    const roomImage = files['roomImage'] as (MultipartFile & { buffer: Buffer });
    if (!roomImage) {
        throw new ValidationError('El campo "roomImage" es requerido');
    }

    const moodBoardImages = (files['moodBoardImages'] as (MultipartFile & { buffer: Buffer })[]) || [];

    // Validar archivos de imagen
    validateImageFile(roomImage, 'roomImage');
    if (moodBoardImages.length) {
        validateImageFiles(moodBoardImages, 'moodBoardImages', { min: 1, max: 10 });
    }

    const furnitureImage = files['furnitureImage'] as (MultipartFile & { buffer: Buffer }) | undefined;
    if (furnitureImage) {
        validateImageFile(furnitureImage, 'furnitureImage');
    }

    const previousResultImage = files['previousResultImage'] as (MultipartFile & { buffer: Buffer }) | undefined;
    if (previousResultImage) {
        validateImageFile(previousResultImage, 'previousResultImage');
    }

    const styleInfluence = parseNumber(fields['styleInfluence'].toString(), 'styleInfluence');
    const isRefinement = parseBoolean(fields['isRefinement'].toString());
    const stylePreset = parseJSON<StylePresetInput>(fields['stylePreset'].toString(), 'stylePreset');

    const dataToValidate = {
        roomType: fields['roomType'],
        textPrompt: fields['textPrompt'],
        styleInfluence,
        isRefinement,
        stylePreset,
    };

    // Validar con Zod
    const validationResult = generateVisualizationSchema.safeParse(dataToValidate);

    if (!validationResult.success) {
        const errors = validationResult.error.issues
            .map((err) => `${err.path.join('.')}: ${err.message}`)
            .join(', ');
        throw new ValidationError(`Errores de validación: ${errors}`);
    }

    const validatedData = validationResult.data;

    return {
        roomImage,
        roomType: validatedData.roomType,
        stylePreset: validatedData.stylePreset,
        moodBoardImages,
        furnitureImage,
        textPrompt: validatedData.textPrompt || '',
        styleInfluence: validatedData.styleInfluence,
        isRefinement: validatedData.isRefinement,
        previousResultImage,
    };
}
