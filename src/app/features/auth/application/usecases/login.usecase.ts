import { Injectable, inject } from '@angular/core';
import { AuthApi } from '../../infrastructure/api/auth.api';
import { AuthStorageService } from '../../infrastructure/services/auth-storage.service';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoginUseCase {

  private api = inject(AuthApi);
  private storage = inject(AuthStorageService);

  execute(data: { username: string; password: string }) {
    return this.api.signIn(data).pipe(
      tap((res: any) => {
        this.storage.save(res.token, res);
      })
    );
  }
}
