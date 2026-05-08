import { Component } from '@angular/core';
import { LoginFormComponent } from '../../components/login-form/login-form.component';
import { LogoComponent } from '../../../../../shared/ui/logo/logo.component';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  standalone: true,
  imports: [LoginFormComponent, LogoComponent, LucideAngularModule],
  template: `
    <div class="min-h-screen w-full flex bg-background">
      
      <!-- LEFT SIDE: BRANDING (Hidden on mobile) -->
      <div class="hidden lg:flex lg:w-1/2 relative bg-muted overflow-hidden flex-col justify-between p-12">
        <div class="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-cyan-500/10 z-0"></div>
        
        <!-- Abstract Shapes -->
        <div class="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div class="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-primary/5 blur-[100px]"></div>
          <div class="absolute bottom-[10%] -right-[10%] w-[60%] h-[60%] rounded-full bg-cyan-500/5 blur-[100px]"></div>
        </div>

        <div class="relative z-10 flex items-center gap-3">
          <app-logo variant="full" [iconSize]="32"></app-logo>
        </div>

        <div class="relative z-10 max-w-lg mt-auto">
          <h1 class="text-4xl font-bold tracking-tight text-foreground mb-4">
            Financial management,<br/>simplified.
          </h1>
          <p class="text-lg text-muted-foreground leading-relaxed">
            Cashito provides an integrated suite of fintech tools designed to help you simulate, track, and manage automotive credits with absolute precision and clarity.
          </p>
        </div>
        
        <div class="relative z-10 flex items-center gap-4 mt-12 text-sm text-muted-foreground font-medium">
          <span class="flex items-center gap-2"><lucide-icon name="check-circle-2" class="w-4 h-4 text-primary"></lucide-icon> Secure</span>
          <span class="flex items-center gap-2"><lucide-icon name="check-circle-2" class="w-4 h-4 text-primary"></lucide-icon> Fast</span>
          <span class="flex items-center gap-2"><lucide-icon name="check-circle-2" class="w-4 h-4 text-primary"></lucide-icon> Reliable</span>
        </div>
      </div>

      <!-- RIGHT SIDE: LOGIN FORM -->
      <div class="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        <div class="absolute top-6 left-6 lg:hidden">
          <app-logo variant="compact" [iconSize]="28"></app-logo>
        </div>
        
        <div class="w-full max-w-[420px] animate-in fade-in zoom-in-95 duration-500">
          <app-login-form />
        </div>
      </div>

    </div>
  `
})
export class LoginPageComponent {}
