import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';

import { AuthService } from 'src/app/shared/services/auth.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { ToastService } from 'src/app/shared/services/toast.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  public loginForm: FormGroup;

  constructor(
    private readonly authSrv: AuthService,
    private readonly toastservice: ToastService,
    private readonly loadingSrv: LoadingService,
    private readonly router: Router
  ) {
    // Inicializar el formulario
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }

   // Getters para acceder fácilmente a los controles del formulario
   get email(): FormControl {
    return this.loginForm.get('email') as FormControl;
  }

  get password(): FormControl {
    return this.loginForm.get('password') as FormControl;
  }

  // Método para manejar el inicio de sesión
  public async doLogin(): Promise<void> {
    if (this.loginForm.invalid) {
      this.toastservice.presentErrorToast('Please fill in all fields correctly.');
      return;
    }
  
    try {
      // Mostrar loading
      await this.loadingSrv.show('Logging in...');
      const { email, password } = this.loginForm.value;
  
      // Llamar al servicio de autenticación
      await this.authSrv.Login(email, password);
  
      // Cerrar loading
      await this.loadingSrv.dismiss();
  
      // Mostrar mensaje de éxito
      this.toastservice.presentToast('Welcome, dear user!', 2000, 'top');
  
      // Verifica si esta línea se ejecuta
      console.log('Redirigiendo a /inicio');
      this.router.navigateByUrl('inicio');
    } catch (error) {
      // Cerrar loading en caso de error
      await this.loadingSrv.dismiss();
  
      // Mostrar mensaje de error
      this.toastservice.presentErrorToast('Invalid email or password, please try again.');
    }
  }
}