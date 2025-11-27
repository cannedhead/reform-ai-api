import type { MultipartFile } from '@fastify/multipart';

export interface StylePreset {
  name: string;
  imageUrl: string;
}

export interface GenerateVisualizationParams {
  roomImage: MultipartFile & { buffer: Buffer };
  roomType: string;
  stylePreset: StylePreset;
  moodBoardImages: (MultipartFile & { buffer: Buffer })[];
  furnitureImage?: (MultipartFile & { buffer: Buffer }) | null;
  textPrompt: string;
  styleInfluence: number;
  isRefinement?: boolean;
}