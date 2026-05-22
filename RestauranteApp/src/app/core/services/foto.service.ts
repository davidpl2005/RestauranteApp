import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class FotoService {

  constructor(private storage: Storage) {
    this.storage.create();
  }

  async tomarFoto(): Promise<string | null> {
    try {
      const foto = await Camera.getPhoto({
        quality: 80,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Prompt, // Pregunta si usar cámara o galería
        promptLabelHeader: 'Foto de perfil',
        promptLabelPhoto: 'Elegir de la galería',
        promptLabelPicture: 'Tomar foto',
        promptLabelCancel: 'Cancelar'
      });

      if (foto.dataUrl) {
        await this.storage.set('foto_perfil', foto.dataUrl);
        return foto.dataUrl;
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  async getFoto(): Promise<string | null> {
    return await this.storage.get('foto_perfil');
  }

  async eliminarFoto(): Promise<void> {
    await this.storage.remove('foto_perfil');
  }
}