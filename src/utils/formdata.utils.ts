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
}

/**
 * Procesa y valida los datos del FormData para la generación de visualización
 */
export async function processVisualizationFormData(
    parts: AsyncIterableIterator<Multipart>
): Promise<ProcessedVisualizationData> {
    const fields: Record<string, string> = {};
    const files: Record<string, MultipartFile | MultipartFile[]> = {};
    console.log('Starting to process form data parts');
    // Procesar todas las partes del FormData
    for await (const part of parts) {
        console.log('Processing part:', part.fieldname, 'of type:', part.type);
        const fieldName = part.fieldname;

        if (part.type === 'file') {
            // Es un archivo - convertir a buffer para consumir el stream
            const buffer = await part.toBuffer();

            // Crear un objeto con los datos del archivo más el buffer
            const fileWithBuffer = {
                ...part,
                buffer, // Guardamos el buffer para usarlo después si es necesario
            };

            // Manejar arrays de archivos (moodBoardImages)
            if (fieldName === 'moodBoardImages') {
                if (!files[fieldName]) {
                    files[fieldName] = [];
                }
                (files[fieldName] as MultipartFile[]).push(fileWithBuffer as any);
            } else {
                files[fieldName] = fileWithBuffer as any;
            }
        } else {
            // Es un campo de texto (type === 'field')
            fields[fieldName] = part.value as string;
        }
    }

    console.log('Fields:', fields);

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

    // Validar furnitureImage si existe
    const furnitureImage = files['furnitureImage'] as (MultipartFile & { buffer: Buffer }) | undefined;
    if (furnitureImage) {
        validateImageFile(furnitureImage, 'furnitureImage');
    }

    // Parsear y validar campos de texto
    const styleInfluence = parseNumber(fields['styleInfluence'], 'styleInfluence');
    const isRefinement = parseBoolean(fields['isRefinement']);
    const stylePreset = parseJSON<StylePresetInput>(fields['stylePreset'], 'stylePreset');

    // Crear el objeto con los datos para validar con Zod
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
        textPrompt: validatedData.textPrompt,
        styleInfluence: validatedData.styleInfluence,
        isRefinement: validatedData.isRefinement,
    };
}
