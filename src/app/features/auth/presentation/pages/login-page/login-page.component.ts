import { Component } from '@angular/core';
import { LoginFormComponent } from '../../components/login-form/login-form.component';
import { LogoComponent } from '../../../../../shared/ui/logo/logo.component';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  standalone: true,
  imports: [LoginFormComponent, LogoComponent, LucideAngularModule],
  template: `
    <div class="min-h-screen w-full flex bg-background overflow-hidden">
      
      <!-- LEFT SIDE: BRANDING (Hidden on mobile) -->
      <div class="hidden lg:flex flex-col justify-between p-12 relative bg-muted overflow-hidden" style="flex: 0 0 35%; min-width: 320px; max-width: 480px;">
        <div class="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-cyan-500/10 z-0"></div>
        
        <!-- Abstract Shapes -->
        <div class="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div class="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-primary/5 blur-[100px]"></div>
          <div class="absolute bottom-[10%] -right-[10%] w-[60%] h-[60%] rounded-full bg-cyan-500/5 blur-[100px]"></div>
        </div>

        <div class="relative z-10 flex items-center gap-3">
          <app-logo variant="full" [iconSize]="32"></app-logo>
        </div>

        <div class="relative z-10 max-w-sm mt-auto">
          <h1 class="text-2xl font-semibold tracking-tight text-foreground mb-2">
            Welcome to Cashito
          </h1>
          <p class="text-sm text-muted-foreground">
            Financial management, simplified.
          </p>
        </div>
      </div>

      <!-- RIGHT SIDE: LOGIN FORM -->
      <div class="flex-1 min-w-0 flex items-center justify-center p-6 sm:p-12 md:p-16 relative">
        <div class="absolute top-6 left-6 lg:hidden">
          <app-logo variant="compact" [iconSize]="28"></app-logo>
        </div>
        
        <div class="w-full max-w-[460px]">
          <app-login-form />
        </div>
      </div>

    </div>
  `
})
export class LoginPageComponent {}
