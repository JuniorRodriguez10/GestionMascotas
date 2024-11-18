import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { User } from 'src/app/interfaces/user';

import { lastValueFrom } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { SupabaseService } from 'src/app/shared/services/supabase.service';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})

export class SignupPage implements OnInit {
  public name!: FormControl;
  public lastName!: FormControl;
  public age!: FormControl;
  public phone!: FormControl;
  public image!: FormControl;
  public email!: FormControl;
  public password!: FormControl;
  public registerForm!: FormGroup;
  public id: string = "";

  constructor(
    private readonly authSrv: AuthService,
    private readonly navCtrl: NavController,
    private readonly loadingSrv: LoadingService,
    private readonly angularFire: AngularFirestore,
    private readonly supabase: SupabaseService,
    private readonly toastService: ToastService,
    private readonly route: ActivatedRoute
  ) {
    this.initForm();
  }

  ngOnInit() {
    this.route.params.subscribe(async params => {
      this.id = params['id'];
      if (this.id) {
        // Si hay un ID, rellenamos el formulario con los datos del usuario
        await this.fillFormForUpdate();
      }
    });
  }

  private initForm() {
    this.name = new FormControl('', [Validators.required]);
    this.lastName = new FormControl('', [Validators.required]);
    this.age = new FormControl('', [Validators.required]);
    this.phone = new FormControl('', [Validators.required]);
    this.image = new FormControl('');
    this.email = new FormControl('', [Validators.required, Validators.email]);
    this.password = new FormControl('', [Validators.required]);

    this.registerForm = new FormGroup({
      name: this.name,
      lastName: this.lastName,
      age: this.age,
      phone: this.phone,
      image: this.image,
      email: this.email,
      password: this.password
    });
  }

  // Método para llenar el formulario con los datos existentes del usuario
  private async fillFormForUpdate() {
    try {
      const userDoc = await this.angularFire.collection('users').doc(this.id).get().toPromise();
  
      // Verificar si el documento existe antes de acceder a sus datos
      if (!userDoc?.exists) {
        console.error("No se encontró el documento del usuario.");
        return;  // Si el documento no existe, salimos de la función
      }
  
      // Ahora se puede asegurar que 'data()' solo se llama si 'userDoc' es válido
      const userData = userDoc.data() as User;  // Usamos el operador ?. para evitar errores si userDoc es undefined
  
      if (!userData) {
        console.error("No se encontraron los datos del usuario.");
        return;
      }
  
      // Actualizamos el formulario con los valores de userData
      this.registerForm.patchValue({
        name: userData?.name,
        lastName: userData?.lastName,
        age: userData?.age,
        phone: userData?.phone,
        image: userData?.image,
        email: userData?.email  // Usamos el email ahora
      });
    } catch (error) {
      console.error("Error al cargar datos para actualización", error);
    }
  }

  // Método para registrar un nuevo usuario
  public async doRegister() {
    try {
      await this.loadingSrv.show();
      const { name, lastName, age, phone, email, password, image } = this.registerForm.value;
      
      // Registrar el usuario en Firebase Authentication
      const response = await this.authSrv.register(email, password);
      const userID = response.user?.uid;
      if (!userID) throw new Error('Failed to get user ID.');
  
      // Subir la imagen si está disponible
      let imageUrl = '';
      if (image) {
        imageUrl = await this.supabase.uploadFileAndGetUrl(image);
      }
  
      // Actualizar la información del usuario en Firestore
      await this.authSrv.updateUser(userID, name, lastName, age, phone, email, imageUrl);
  
      this.toastService.presentToast('Registration successful, welcome!', 2000, 'top');
      this.navCtrl.navigateForward('/login');
      await this.loadingSrv.dismiss();
    } catch (error) {
      console.error(error);
      await this.loadingSrv.dismiss();
      this.toastService.presentErrorToast('Registration failed. Please try again.');
    }
  }

  // Método para actualizar los datos del usuario
  public async doUpdate() {
    try {
      await this.loadingSrv.show();
      const { name, lastName, age, phone, image, email } = this.registerForm.value;
      let imageUrl = "";
      
      if (image) {
        imageUrl = await this.supabase.uploadFileAndGetUrl(image);
      }

      // Llamamos al servicio para actualizar los datos del usuario
      await this.authSrv.updateUser(this.id, name, lastName, age, phone, email, imageUrl);
      this.toastService.presentToast('User updated successfully!', 2000, 'top');
      this.navCtrl.navigateBack("/profile");  // Navegamos hacia el perfil del usuario, ajusta según necesites
      await this.loadingSrv.dismiss();
    } catch (error) {
      console.error(error);
      await this.loadingSrv.dismiss();
      this.toastService.presentErrorToast('Update failed. Please try again.');
    }
  }
}