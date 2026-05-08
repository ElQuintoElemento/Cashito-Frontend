import { Component } from '@angular/core';
import { RegisterFormComponent } from '../../components/register-form/register-form.component';
import { LogoComponent } from '../../../../../shared/ui/logo/logo.component';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  standalone: true,
  imports: [RegisterFormComponent, LogoComponent, LucideAngularModule],
  template: `
    <div class="min-h-screen w-full flex bg-background">
      
      <!-- LEFT SIDE: BRANDING (Hidden on mobile) -->
      <div class="hidden lg:flex lg:w-1/2 relative bg-muted overflow-hidden flex-col justify-between p-12">
        <div class="absolute inset-0 bg-gradient-to-tr from-primary/10 via-background to-cyan-500/10 z-0"></div>
        
        <!-- Abstract Shapes -->
        <div class="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div class="absolute top-[20%] -right-[20%] w-[80%] h-[80%] rounded-full bg-primary/5 blur-[120px]"></div>
          <div class="absolute -bottom-[10%] -left-[10%] w-[60%] h-[60%] rounded-full bg-cyan-500/5 blur-[100px]"></div>
        </div>

        <div class="relative z-10 flex items-center gap-3">
          <app-logo variant="full" [iconSize]="32"></app-logo>
        </div>

        <div class="relative z-10 max-w-lg mt-auto">
          <h1 class="text-4xl font-bold tracking-tight text-foreground mb-4">
            Join the future of<br/>fintech management.
          </h1>
          <p class="text-lg text-muted-foreground leading-relaxed">
            Create an account to start simulating automotive credits, managing clients, and tracking your business growth with advanced analytics.
          </p>
        </div>
        
        <div class="relative z-10 flex items-center gap-4 mt-12 text-sm text-muted-foreground font-medium">
          <span class="flex items-center gap-2"><lucide-icon name="check-circle-2" class="w-4 h-4 text-primary"></lucide-icon> Unlimited Clients</span>
          <span class="flex items-center gap-2"><lucide-icon name="check-circle-2" class="w-4 h-4 text-primary"></lucide-icon> Live Analytics</span>
          <span class="flex items-center gap-2"><lucide-icon name="check-circle-2" class="w-4 h-4 text-primary"></lucide-icon> Free forever</span>
        </div>
      </div>

      <!-- RIGHT SIDE: REGISTER FORM -->
      <div class="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative overflow-y-auto">
        <div class="absolute top-6 left-6 lg:hidden">
          <app-logo variant="compact" [iconSize]="28"></app-logo>
        </div>
        
        <div class="w-full max-w-[420px] animate-in fade-in zoom-in-95 duration-500 py-12 lg:py-0">
          <app-register-form />
        </div>
      </div>

    </div>
  `
})
export class RegisterPageComponent {}
