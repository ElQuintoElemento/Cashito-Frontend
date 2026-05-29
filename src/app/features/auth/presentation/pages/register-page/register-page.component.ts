import { Component } from '@angular/core';
import { RegisterFormComponent } from '../../components/register-form/register-form.component';
import { LogoComponent } from '../../../../../shared/ui/logo/logo.component';
import { LucideAngularModule } from 'lucide-angular';
import {TranslateModule} from '@ngx-translate/core';

@Component({
  standalone: true,
  imports: [RegisterFormComponent, LogoComponent, LucideAngularModule, TranslateModule],
  template: `
    <div class="min-h-screen flex items-center justify-center px-6 py-12">

      <div class="w-full max-w-md">

        <!-- HEADER -->
        <div class="flex flex-col items-center text-center mb-8">

          <app-logo
            variant="full"
            [iconSize]="34">
          </app-logo>

          <h1 class="mt-6 text-4xl font-bold tracking-tight text-foreground">
            {{ 'auth.register.getStarted' | translate }}
          </h1>

          <p class="mt-3 text-muted-foreground text-sm">
            {{ 'auth.register.futureFintech' | translate }}
          </p>

        </div>

        <!-- FORM -->
        <app-register-form></app-register-form>

      </div>

    </div>
  `
})
export class RegisterPageComponent {}
