import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

// expo-secure-store wraps the iOS Keychain / Android Keystore — neither
// exists in a browser, so its web build is a non-functional stub. This
// wrapper falls back to localStorage on web and keeps SecureStore on
// native platforms, without needing platform checks scattered everywhere
// storage is used.
//
// NOTE: localStorage is NOT secure storage. On web this is fine for a
// dev-console tool, but if this app is meant to be used in-browser for
// real (not just Expo's web preview during development), treat tokens
// stored this way as more exposed than on native — e.g. shorter-lived
// tokens, or skip persisting the auth token on web entirely.

export async function setItemAsync(key: string, value: string): Promise<void> {
  if (Platform.OS === "web") {
    localStorage.setItem(key, value);
    return;
  }
  await SecureStore.setItemAsync(key, value);
}

export async function getItemAsync(key: string): Promise<string | null> {
  if (Platform.OS === "web") {
    return localStorage.getItem(key);
  }
  return SecureStore.getItemAsync(key);
}

export async function deleteItemAsync(key: string): Promise<void> {
  if (Platform.OS === "web") {
    localStorage.removeItem(key);
    return;
  }
  await SecureStore.deleteItemAsync(key);
}
