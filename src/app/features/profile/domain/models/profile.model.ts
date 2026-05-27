export interface UserProfile {
  id: number;
  username?: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface UpdateUserProfileRequest {
  email: string;
  firstName: string;
  lastName: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

