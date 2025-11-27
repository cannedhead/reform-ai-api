import { FastifyRequest, FastifyReply } from 'fastify';
import { processVisualizationFormData } from '../utils/formdata.utils.js';
import { ValidationError } from '../utils/validation.utils.js';
import { generateVisualization } from '../services/geminiService.js';

export async function generateVisualizationController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    if (!request.isMultipart()) {
      return reply.status(400).send({
        error: 'Bad Request',
        message: 'El contenido debe ser multipart/form-data',
      });
    }

    // Obtener las partes del FormData
    const parts = request.parts();

    // Procesar y validar los datos
    const data = await processVisualizationFormData(parts);

    // Generar la visualización usando Gemini
    const generatedImageBase64 = await generateVisualization(data);

    return reply.status(200).send({
      message: 'Visualización generada exitosamente',
      data: {
        image: generatedImageBase64,
        metadata: {
          roomType: data.roomType,
          stylePreset: data.stylePreset.name,
          isRefinement: data.isRefinement,
        },
      },
    });

  } catch (error) {
    console.log(error)
    // Manejar errores de validación
    if (error instanceof ValidationError) {
      console.log('Validation error:', error.message);
      return reply.status(400).send({
        error: 'Validation Error',
        message: error.message,
      });
    }

    // Manejar otros errores
    request.log.error(error);
    return reply.status(500).send({
      error: 'Internal Server Error',
      message: 'Ocurrió un error al procesar la solicitud',
    });
  }
}
