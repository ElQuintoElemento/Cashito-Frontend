import {inject, Injectable} from '@angular/core';
import {AuthApi} from '../../infrastructure/api/auth.api';

@Injectable({ providedIn: 'root' })
export class RegisterUseCase {

  private api = inject(AuthApi);

  execute(data: any) {
    return this.api.signUp(data);
  }
}
