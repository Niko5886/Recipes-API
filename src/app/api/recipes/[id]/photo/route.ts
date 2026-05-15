import { NextResponse, NextRequest } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { db } from '@/db';
import { recipes } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getUserIdFromRequest } from '@/lib/auth';
import { createR2Client, getR2Config } from '@/lib/r2';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const r2 = getR2Config();
    if (!r2) {
      return NextResponse.json(
        { error: 'R2 is not configured' },
        { status: 500 }
      );
    }

    const s3Client = createR2Client(r2);
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const recipeId = parseInt(resolvedParams.id);
    if (isNaN(recipeId)) {
      return NextResponse.json({ error: 'Invalid recipe ID' }, { status: 400 });
    }

    // Check if recipe exists and user owns it
    const existingRecipe = await db.query.recipes.findFirst({
      where: eq(recipes.id, recipeId),
    });

    if (!existingRecipe) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
    }

    if (existingRecipe.userId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `recipes/${recipeId}-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    await s3Client.send(
      new PutObjectCommand({
        Bucket: r2.bucket,
        Key: fileName,
        Body: buffer,
        ContentType: file.type,
      })
    );

    const publicUrl = `${r2.publicUrl}/${fileName}`;

    await db.update(recipes)
      .set({ photoUrl: publicUrl, updatedAt: new Date() })
      .where(eq(recipes.id, recipeId));

    return NextResponse.json({ photoUrl: publicUrl }, { status: 200 });

  } catch (error: any) {
    console.error('Error uploading photo:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
