import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

type buttonType = "text" | "number" | "tel" | "email" | "password";

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class InputComponent  implements OnInit {

  @Input() control: FormControl = new FormControl(''); 
  @Input() type: buttonType = "text";
  @Input() label: string = '';
  @Input() autocomplete: string = 'off';
  @Input() icon?: string;

  isPassword: boolean = false;
  hide: boolean = true;

  constructor() {}

  ngOnInit() {
   
    this.isPassword = this.type === 'password';
  }

  public setValue(event: any): void {
    if (this.control) {
      this.control.setValue(event.target.value); 
    }
  }

  public showOrHidePassword(): void {
    this.hide = !this.hide;
    this.type = this.hide ? 'password' : 'text';
  }
}