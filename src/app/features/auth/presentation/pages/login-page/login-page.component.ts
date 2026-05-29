import { Component } from '@angular/core';
import { LoginFormComponent } from '../../components/login-form/login-form.component';
import { LogoComponent } from '../../../../../shared/ui/logo/logo.component';
import { LucideAngularModule } from 'lucide-angular';
import {TranslateModule} from '@ngx-translate/core';

@Component({
  standalone: true,
  imports: [LoginFormComponent, LogoComponent, LucideAngularModule, TranslateModule ],
  template: `
    <div class="min-h-screen flex items-center justify-center px-6 py-12">

      <div class="w-full max-w-md">

        <!-- HEADER -->
        <div class="flex flex-col items-center text-center mb-8">

          <app-logo
            variant="full"
            [iconSize]="68">
          </app-logo>


          <p class="mt-3 text-muted-foreground text-m">
            {{ 'auth.login.financialManagement' | translate }}
          </p>

        </div>

        <!-- FORM -->
        <app-login-form></app-login-form>

      </div>

    </div>
  `
})
export class LoginPageComponent {}
