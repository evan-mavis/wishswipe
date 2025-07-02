export interface DbUser {
  id: string;
  firebaseUid: string;
  email: string;
  displayName?: string;
  photoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
}

export interface CreateUserRequest {
  firebaseUid: string;
  email: string;
  displayName?: string;
  photoUrl?: string;
}
