import {Component} from '@angular/core';
import {RegisterFormComponent} from '../../components/register-form/register-form.component';

@Component({
  standalone: true,
  imports: [RegisterFormComponent],
  template: `<app-register-form />`
})
export class RegisterPageComponent {}
