import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

export const dynamic = 'force-dynamic';
//flux model code
const client = new OpenAI({
  baseURL: 'https://api.studio.nebius.com/v1/',
  apiKey: process.env.NEBIUS_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // flux model code 
    const response = await client.images.generate({
      model: "black-forest-labs/flux-dev",
      response_format: "url",
      extra_body: {
          response_extension: "webp",
          width: 1024,
          height: 1024,
          num_inference_steps: 28,
          negative_prompt: "",
          seed: -1
      },
      prompt: prompt,
  })

  console.log("image generated ",response )

    // const response = await openai.images.generate({
    //   model: "dall-e-3",
    //   prompt,
    //   n: 1,
    //   size: "1024x1024",
    //   quality: "standard",
    //   response_format: "url",
    // });

    return NextResponse.json({ imageUrl: response.data[0].url });
  } catch (error: any) {
    console.error('Error generating image:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate image' },
      { status: 500 }
    );
  }
}