import { MultipartFile } from '@fastify/multipart';

/**
 * Valida que un archivo tenga un tipo MIME de imagen permitido
 */
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export interface FileValidationOptions {
  maxSize?: number;
  allowedTypes?: string[];
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Valida un archivo de imagen
 */
export function validateImageFile(
  file: MultipartFile,
  fieldName: string,
  options: FileValidationOptions = {}
): void {
  const maxSize = options.maxSize || MAX_FILE_SIZE;
  const allowedTypes = options.allowedTypes || ALLOWED_IMAGE_TYPES;

  if (!file) {
    throw new ValidationError(`El campo '${fieldName}' es requerido`);
  }

  if (!file.mimetype) {
    throw new ValidationError(`El archivo '${fieldName}' no tiene un tipo MIME válido`);
  }

  if (!allowedTypes.includes(file.mimetype)) {
    throw new ValidationError(
      `El archivo '${fieldName}' debe ser una imagen (${allowedTypes.join(', ')})`
    );
  }

  // Nota: El tamaño se valida durante el streaming en @fastify/multipart
  // pero podemos agregar validaciones adicionales aquí si es necesario
}

/**
 * Convierte un archivo a Buffer para procesarlo
 */
export async function fileToBuffer(file: MultipartFile): Promise<Buffer> {
  return await file.toBuffer();
}

/**
 * Valida un array de archivos
 */
export function validateImageFiles(
  files: MultipartFile[],
  fieldName: string,
  options: { min?: number; max?: number } & FileValidationOptions = {}
): void {
  const { min = 0, max = Infinity, ...validationOptions } = options;

  if (files.length < min) {
    throw new ValidationError(
      `Debes proporcionar al menos ${min} archivo(s) en '${fieldName}'`
    );
  }

  if (files.length > max) {
    throw new ValidationError(
      `No puedes proporcionar más de ${max} archivo(s) en '${fieldName}'`
    );
  }

  files.forEach((file, index) => {
    validateImageFile(file, `${fieldName}[${index}]`, validationOptions);
  });
}

/**
 * Parsea un valor de string a number con validación
 */
export function parseNumber(value: string | undefined, fieldName: string): number {
  if (!value) {
    throw new ValidationError(`El campo '${fieldName}' es requerido`);
  }

  const parsed = Number(value);
  
  if (isNaN(parsed)) {
    throw new ValidationError(`El campo '${fieldName}' debe ser un número válido`);
  }

  return parsed;
}

/**
 * Parsea un valor de string a boolean
 */
export function parseBoolean(value: string | undefined): boolean {
  if (!value) return false;
  return value === 'true' || value === '1';
}

/**
 * Parsea un JSON string con validación
 */
export function parseJSON<T>(value: string | undefined, fieldName: string): T {
  if (!value) {
    throw new ValidationError(`El campo '${fieldName}' es requerido`);
  }

  try {
    return JSON.parse(value) as T;
  } catch (error) {
    throw new ValidationError(`El campo '${fieldName}' no es un JSON válido`);
  }
}
