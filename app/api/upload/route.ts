import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || ''

    // Fast Path: Generate Signed Upload URL for direct client-to-storage video upload
    if (contentType.includes('application/json')) {
      const { fileName } = await request.json()
      if (!fileName) {
        return NextResponse.json({ error: 'No fileName provided' }, { status: 400 })
      }

      const rawFileName = fileName || 'uploaded-file'
      const nameParts = rawFileName.split('.')
      const ext = nameParts.length > 1 ? nameParts.pop() : ''
      const baseName = nameParts.join('.').replace(/[^a-zA-Z0-9._-]/g, '_')
      const cleanFileName = fileName.includes('_') && !isNaN(Number(fileName.split('_').pop()?.split('.')[0]))
        ? fileName.replace(/[^a-zA-Z0-9._-]/g, '_')
        : (ext ? `${baseName}_${Date.now()}.${ext}` : `${baseName}_${Date.now()}`)
      const filePath = `uploads/${cleanFileName}`

      const { data: signedData, error: signedError } = await supabaseAdmin.storage
        .from('assets')
        .createSignedUploadUrl(filePath, { upsert: true })

      if (signedError || !signedData) {
        return NextResponse.json(
          { error: signedError?.message || 'Failed to create signed upload URL' },
          { status: 500 }
        )
      }

      const { data: urlData } = supabase.storage
        .from('assets')
        .getPublicUrl(filePath)

      return NextResponse.json({
        signedUrl: signedData.signedUrl,
        token: signedData.token,
        path: signedData.path,
        publicUrl: urlData.publicUrl,
      })
    }

    // Fallback Path: Server formData upload
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const rawFileName = file.name || 'uploaded-file'
    const nameParts = rawFileName.split('.')
    const ext = nameParts.length > 1 ? nameParts.pop() : ''
    const baseName = nameParts.join('.').replace(/[^a-zA-Z0-9._-]/g, '_')
    const fileName = ext ? `${baseName}_${Date.now()}.${ext}` : `${baseName}_${Date.now()}`
    const filePath = `uploads/${fileName}`

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Attempt upload with admin client first (bypasses RLS policies)
    let uploadRes = await supabaseAdmin.storage
      .from('assets')
      .upload(filePath, buffer, {
        contentType: file.type || 'video/mp4',
        cacheControl: '3600',
        upsert: true,
      })

    if (uploadRes.error) {
      console.warn('supabaseAdmin upload failed, falling back to anon client:', uploadRes.error)
      uploadRes = await supabase.storage
        .from('assets')
        .upload(filePath, buffer, {
          contentType: file.type || 'video/mp4',
          cacheControl: '3600',
          upsert: true,
        })
    }

    if (uploadRes.error) {
      return NextResponse.json({ error: uploadRes.error.message }, { status: 500 })
    }

    const { data: urlData } = supabase.storage
      .from('assets')
      .getPublicUrl(filePath)

    return NextResponse.json({ url: urlData.publicUrl })
  } catch (err: any) {
    console.error('API upload error:', err)
    return NextResponse.json({ error: err.message || 'Server upload failed' }, { status: 500 })
  }
}

