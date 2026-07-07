import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { 
  LucideAngularModule, LayoutDashboard, Users, Car, Calculator, CreditCard, 
  ChevronLeft, ChevronRight, Search, Bell, User, Plus, MoreHorizontal, 
  Pencil, Trash2, LogOut, Settings, Globe, Sun, Moon,
  Save, CircleDollarSign, Percent, TrendingUp, TrendingDown, Activity, BarChart3,
  Wallet, List, Calendar, Eye, CheckCircle, XCircle, PlayCircle, Award,
  MoreVertical, Check, AlertCircle, Lock, AlertTriangle, ChevronDown,
  CalendarDays, MousePointerClick, Banknote, ArrowUpRight, X, AtSign, Mail, Loader2, EyeOff,
  FileText, FileSpreadsheet
} from 'lucide-angular';

import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {authInterceptor} from './core/auth/interceptors/auth.interceptor';
import {errorInterceptor} from './core/auth/interceptors/error.interceptor';

// Importa tu interceptor funcional

// Cargador de traducciones
export const HttpLoaderFactory = (http: HttpClient) => new TranslateHttpLoader(http);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),

    provideRouter(routes),

    provideHttpClient(
      withInterceptors([
        authInterceptor,
        errorInterceptor]) //  Interceptor funcional
    ),

    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      }),
      LucideAngularModule.pick({
        LayoutDashboard,
        Users,
        Car,
        Calculator,
        CreditCard,
        ChevronLeft,
        ChevronRight,
        Search,
        Bell,
        User,
        Plus,
        MoreHorizontal,
        Pencil,
        Trash2,
        LogOut,
        Settings,
        Globe,
        Sun,
        Moon,
        Save,
        CircleDollarSign,
        Percent,
        TrendingUp,
        TrendingDown,
        Activity,
        BarChart3,
        Wallet,
        List,
        Calendar,
        Eye,
        EyeOff,
        CheckCircle,
        XCircle,
        PlayCircle,
        Award,
        MoreVertical,
        Check,
        AlertCircle,
        Lock,
        AlertTriangle,
        ChevronDown,
        CalendarDays,
        MousePointerClick,
        Banknote,
        ArrowUpRight,
        X,
        AtSign,
        Mail,
        Loader2,
        FileText,
        FileSpreadsheet
      })
    )
  ]
};
