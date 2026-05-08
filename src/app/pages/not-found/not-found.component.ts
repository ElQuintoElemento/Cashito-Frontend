import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonDirective } from '../../shared/ui/button/button.directive';
import { LogoComponent } from '../../shared/ui/logo/logo.component';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink, ButtonDirective, LogoComponent, LucideAngularModule],
  templateUrl: './not-found.component.html'
})
export class NotFoundComponent {

}
