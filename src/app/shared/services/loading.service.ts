import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  constructor(private readonly loadingCtrl : LoadingController) { }

  // Mostrar el loading
  public async show(message: string = 'Please wait...') {
    const loading = await this.loadingCtrl.create({
      message: message,
      spinner: 'crescent',
      backdropDismiss: false, // No permitir cerrar al hacer click fuera
    });
    await loading.present();
  }

  // Cerrar el loading
  public async dismiss() {
    await this.loadingCtrl.dismiss();
  }
}