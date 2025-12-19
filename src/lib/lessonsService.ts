import { supabase } from "@/integrations/supabase/client";
import { Lesson } from "@/types";

// Type for the lessons table (not in auto-generated types yet)
interface LessonRow {
    id: string;
    title: string;
    description: string | null;
    video_url: string | null;
    embed_link: string | null;
    pdf_urls: string[] | null;
    created_by: string;
    created_at: string;
    updated_at: string;
}

/**
 * Fetch all lessons from the database
 */
export async function getLessons(): Promise<Lesson[]> {
    const { data, error } = await supabase
        .from('lessons' as any)
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching lessons:', error);
        throw error;
    }

    return (data as unknown as LessonRow[]).map(lesson => ({
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        videoUrl: lesson.video_url,
        embedLink: lesson.embed_link,
        pdfUrls: lesson.pdf_urls,
        createdBy: lesson.created_by,
        createdAt: lesson.created_at,
        updatedAt: lesson.updated_at,
    }));
}

/**
 * Create a new lesson
 */
export async function createLesson(lesson: {
    title: string;
    description?: string;
    videoUrl?: string;
    embedLink?: string;
    pdfUrls?: string[];
    createdBy: string;
}): Promise<Lesson> {
    const { data, error } = await supabase
        .from('lessons' as any)
        .insert({
            title: lesson.title,
            description: lesson.description || null,
            video_url: lesson.videoUrl || null,
            embed_link: lesson.embedLink || null,
            pdf_urls: lesson.pdfUrls || null,
            created_by: lesson.createdBy,
        })
        .select()
        .single();

    if (error) {
        console.error('Error creating lesson:', error);
        throw error;
    }

    const row = data as unknown as LessonRow;
    return {
        id: row.id,
        title: row.title,
        description: row.description,
        videoUrl: row.video_url,
        embedLink: row.embed_link,
        pdfUrls: row.pdf_urls,
        createdBy: row.created_by,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}

/**
 * Update an existing lesson
 */
export async function updateLesson(
    id: string,
    updates: Partial<Omit<Lesson, 'id' | 'createdBy' | 'createdAt' | 'updatedAt'>>
): Promise<Lesson> {
    const { data, error } = await supabase
        .from('lessons' as any)
        .update({
            title: updates.title,
            description: updates.description,
            video_url: updates.videoUrl,
            embed_link: updates.embedLink,
            pdf_urls: updates.pdfUrls,
            updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating lesson:', error);
        throw error;
    }

    const row = data as unknown as LessonRow;
    return {
        id: row.id,
        title: row.title,
        description: row.description,
        videoUrl: row.video_url,
        embedLink: row.embed_link,
        pdfUrls: row.pdf_urls,
        createdBy: row.created_by,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}

/**
 * Delete a lesson
 */
export async function deleteLesson(id: string): Promise<void> {
    const { error } = await supabase
        .from('lessons' as any)
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting lesson:', error);
        throw error;
    }
}

/**
 * Upload a video file to Supabase storage
 */
export async function uploadVideo(
    file: File,
    onProgress?: (progress: number) => void
): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data, error } = await supabase.storage
        .from('lesson-videos')
        .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
        });

    if (error) {
        console.error('Error uploading video:', error);
        throw error;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
        .from('lesson-videos')
        .getPublicUrl(data.path);

    return publicUrl;
}

/**
 * Upload a PDF file to Supabase storage
 */
export async function uploadPDF(file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data, error } = await supabase.storage
        .from('lesson-pdfs')
        .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
        });

    if (error) {
        console.error('Error uploading PDF:', error);
        throw error;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
        .from('lesson-pdfs')
        .getPublicUrl(data.path);

    return publicUrl;
}
