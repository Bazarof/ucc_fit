import { FirebaseAuthTypes } from "@react-native-firebase/auth";

export interface User {
  displayName: string | null;
  email: string | null;
  emailVerified: boolean;

  // isAnonymous: boolean;

  // metadata: UserMetadata;

  // multiFactor: MultiFactor | null;

  phoneNumber: string | null;

  photoURL: string | null;

  // providerData: UserInfo[];

  // providerId: string;

  uid: string;

  campus: "torrente" | "calasanz";
  role: "admin" | "student" | "coach" | "nutritionist";
}
