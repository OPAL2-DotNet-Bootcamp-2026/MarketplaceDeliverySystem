import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { tap } from 'rxjs';

import {
  LoginRequest,
  LoginResponse,
  RegistrationRequest,
} from '../models/marketplace.models';
import { API_BASE_URL } from './api.config';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tokenSignal = signal(this.readStorage('authToken'));
  private readonly roleSignal = signal(this.readStorage('userRole'));
  private readonly fullNameSignal = signal(this.readStorage('userFullName'));

  readonly token = this.tokenSignal.asReadonly();
  readonly role = this.roleSignal.asReadonly();
  readonly fullName = this.fullNameSignal.asReadonly();
  readonly isAuthenticated = computed(() => Boolean(this.tokenSignal()));
  readonly normalizedRole = computed(() => this.roleSignal()?.trim().toLowerCase() ?? '');
  readonly isCustomer = computed(() => this.normalizedRole() === 'customer');
  readonly isDriver = computed(() => this.normalizedRole() === 'driver');

  login(credentials: LoginRequest) {
    return this.http
      .post<LoginResponse>(`${API_BASE_URL}/api/User/Login`, credentials)
      .pipe(tap((response) => this.saveSession(response)));
  }

  register(data: RegistrationRequest) {
    return this.http.post(`${API_BASE_URL}/api/Customer/Register`, data, {
      responseType: 'text',
    });
  }

  logout(): void {
    this.tokenSignal.set(null);
    this.roleSignal.set(null);
    this.fullNameSignal.set(null);

    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userFullName');
    }
  }

  private saveSession(response: LoginResponse): void {
    this.tokenSignal.set(response.token);
    this.roleSignal.set(response.role);
    this.fullNameSignal.set(response.fullName);

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('userRole', response.role);
      localStorage.setItem('userFullName', response.fullName);
    }
  }

  private readStorage(key: string): string | null {
    return typeof localStorage === 'undefined' ? null : localStorage.getItem(key);
  }
}
