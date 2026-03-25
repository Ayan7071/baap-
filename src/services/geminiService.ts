import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, FaceShape, Hairstyle } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export const HAIRSTYLES: Hairstyle[] = [
  // Trending / Instagram Reel Styles
  {
    id: 'broccoli-hair',
    name: 'Broccoli Hair (Curly Fluffy Top)',
    image: 'https://images.unsplash.com/photo-1503443207922-dff7d543fd0e?w=400&h=400&fit=crop',
    suitability: 0,
    reason: '',
    description: 'High volume, curly top with short sides. Extremely popular on social media.',
    category: 'trending'
  },
  {
    id: 'wolf-cut',
    name: 'Wolf Cut (Layered + Messy)',
    image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400&h=400&fit=crop',
    suitability: 0,
    reason: '',
    description: 'A wild, layered look that combines a shag and a mullet.',
    category: 'trending'
  },
  {
    id: 'two-block',
    name: 'Two Block Cut (Korean Style)',
    image: 'https://images.unsplash.com/photo-1621605815841-2dddb3970b8a?w=400&h=400&fit=crop',
    suitability: 0,
    reason: '',
    description: 'A K-Pop inspired look with disconnected sides and a long top.',
    category: 'trending'
  },
  {
    id: 'modern-mullet',
    name: 'Modern Mullet',
    image: 'https://images.unsplash.com/photo-1517832207067-4db24a2ae47c?w=400&h=400&fit=crop',
    suitability: 0,
    reason: '',
    description: 'Business in the front, party in the back, but with a modern fade.',
    category: 'trending'
  },
  {
    id: 'edgar-cut',
    name: 'Edgar Cut',
    image: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=400&h=400&fit=crop',
    suitability: 0,
    reason: '',
    description: 'A sharp, straight-across fringe with high-tapered sides.',
    category: 'trending'
  },
  {
    id: 'burst-fade',
    name: 'Burst Fade + Design',
    image: 'https://images.unsplash.com/photo-1593702295094-ada74bc4a149?w=400&h=400&fit=crop',
    suitability: 0,
    reason: '',
    description: 'A curved fade around the ear, often paired with artistic hair designs.',
    category: 'trending'
  },

  // Office + Classy + Modern Look
  {
    id: 'textured-crop-matte',
    name: 'Textured Crop (Matte Finish)',
    image: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&h=400&fit=crop',
    suitability: 0,
    reason: '',
    description: 'Clean, professional crop with a natural, non-shiny finish.',
    category: 'classy'
  },
  {
    id: 'low-fade-side-part',
    name: 'Low Fade + Side Part',
    image: 'https://images.unsplash.com/photo-1503443207922-dff7d543fd0e?w=400&h=400&fit=crop',
    suitability: 0,
    reason: '',
    description: 'A timeless gentleman\'s cut with a modern low fade.',
    category: 'classy'
  },
  {
    id: 'taper-fade-flow',
    name: 'Taper Fade + Natural Flow',
    image: 'https://images.unsplash.com/photo-1517832207067-4db24a2ae47c?w=400&h=400&fit=crop',
    suitability: 0,
    reason: '',
    description: 'Subtle taper that allows your hair\'s natural movement to shine.',
    category: 'classy'
  },
  {
    id: 'messy-quiff',
    name: 'Messy Quiff',
    image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400&h=400&fit=crop',
    suitability: 0,
    reason: '',
    description: 'Effortlessly stylish with volume at the front and a relaxed feel.',
    category: 'classy'
  },
  {
    id: 'soft-pompadour',
    name: 'Soft Pompadour (Natural Look)',
    image: 'https://images.unsplash.com/photo-1621605815841-2dddb3970b8a?w=400&h=400&fit=crop',
    suitability: 0,
    reason: '',
    description: 'A softer, more approachable version of the classic pompadour.',
    category: 'classy'
  },

  // Long Hair (Fast Growing)
  {
    id: 'man-bun',
    name: 'Man Bun (Clean + Beard Combo)',
    image: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&h=400&fit=crop',
    suitability: 0,
    reason: '',
    description: 'Tied back for a clean look, perfectly complemented by a well-groomed beard.',
    category: 'long'
  },
  {
    id: 'flow-hairstyle',
    name: 'Flow Hairstyle (Hockey Style)',
    image: 'https://images.unsplash.com/photo-1503443207922-dff7d543fd0e?w=400&h=400&fit=crop',
    suitability: 0,
    reason: '',
    description: 'Medium to long hair that flows naturally back and to the sides.',
    category: 'long'
  },
  {
    id: 'layered-shoulder-length',
    name: 'Layered Shoulder Length Hair',
    image: 'https://images.unsplash.com/photo-1517832207067-4db24a2ae47c?w=400&h=400&fit=crop',
    suitability: 0,
    reason: '',
    description: 'Adds dimension and movement to longer hair with strategic layers.',
    category: 'long'
  },
  {
    id: 'curtain-bangs',
    name: 'Curtain Bangs (90s Comeback)',
    image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400&h=400&fit=crop',
    suitability: 0,
    reason: '',
    description: 'The iconic 90s look, parted down the middle to frame the face.',
    category: 'long'
  },
  {
    id: 'wavy-long-hair',
    name: 'Wavy Long Hair (Natural Look)',
    image: 'https://images.unsplash.com/photo-1621605815841-2dddb3970b8a?w=400&h=400&fit=crop',
    suitability: 0,
    reason: '',
    description: 'Embraces natural waves for a relaxed, bohemian aesthetic.',
    category: 'long'
  }
];

export async function analyzeFace(base64Image: string): Promise<AnalysisResult> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image.split(',')[1],
            },
          },
          {
            text: `Analyze this face for hairstyle recommendations. 
            Identify the face shape (oval, round, square, heart, diamond).
            Analyze the jawline, forehead width, face length, and hairline.
            Provide suitability scores (0-100) and reasons for each of these hairstyles: ${HAIRSTYLES.map(h => h.name).join(', ')}.
            Return the result in JSON format.`,
          },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          faceShape: { type: Type.STRING, enum: ['oval', 'round', 'square', 'heart', 'diamond'] },
          features: {
            type: Type.OBJECT,
            properties: {
              jawline: { type: Type.STRING },
              forehead: { type: Type.STRING },
              faceLength: { type: Type.STRING },
              hairline: { type: Type.STRING },
            },
            required: ['jawline', 'forehead', 'faceLength', 'hairline'],
          },
          recommendations: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                suitability: { type: Type.NUMBER },
                reason: { type: Type.STRING },
              },
              required: ['name', 'suitability', 'reason'],
            },
          },
        },
        required: ['faceShape', 'features', 'recommendations'],
      },
    },
  });

  const data = JSON.parse(response.text);
  
  // Map recommendations back to HAIRSTYLES
  const recommendations: Hairstyle[] = HAIRSTYLES.map(h => {
    const rec = data.recommendations.find((r: any) => r.name === h.name);
    return {
      ...h,
      suitability: rec?.suitability || 0,
      reason: rec?.reason || 'Recommended based on your face shape.'
    };
  }).sort((a, b) => b.suitability - a.suitability);

  return {
    faceShape: data.faceShape as FaceShape,
    features: data.features,
    recommendations
  };
}

export async function applyHairstyle(base64Image: string, hairstyleName: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image",
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: base64Image.split(',')[1],
          },
        },
        {
          text: `Apply a realistic ${hairstyleName} hairstyle to the person in this image. 
          The new hairstyle should look natural, matching their hair color and blending seamlessly with their face. 
          Maintain all original facial features, skin tone, and background. 
          The result should look like a professional salon photo.`,
        },
      ],
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }

  throw new Error("Failed to generate styled image");
}
