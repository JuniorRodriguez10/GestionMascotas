import { Injectable } from '@angular/core';
import { supabase } from './supabase.client';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {

  private supabase: SupabaseClient;

  constructor() {
    
    this.supabase = createClient('https://ieektypckqkjmguojyap.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllZWt0eXBja3Fram1ndW9qeWFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEyODE5NjksImV4cCI6MjA0Njg1Nzk2OX0.UiMjHo9HHUpuLGNlqR9UuPyIrNILfRrnKICGxt0X_Gw');
  }

  // Función para subir archivos y obtener la URL pública
  async uploadFileAndGetUrl(file: File): Promise<string> {
    const fileName = `${Date.now()}_${file.name}`;

    // Subir el archivo al bucket del proyect
    const { data, error } = await this.supabase.storage.from('PictureMascotas').upload(fileName, file);

    // por si falla la subida se muestra error
    if (error) {
      throw error;
    }

    // Obtener la URL pública del archivo
    const { data: publicUrlData } = this.supabase.storage.from('PictureMascotas').getPublicUrl(fileName);

    // Retornamos la URL pública
    return publicUrlData.publicUrl;
  }
}