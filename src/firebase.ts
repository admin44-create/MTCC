import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDocFromServer,
  collection,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { ServiceItem, ApplicationRecord, KendraItem } from './types';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// CRITICAL: The app will break without specifying the firestoreDatabaseId
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.warn('Firestore Operation Info:', JSON.stringify(errInfo));
  return errInfo;
}

// Test connection on boot
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Please check your Firebase configuration: client is offline');
    }
  }
}
testConnection();

// Firestore Database Sync Helpers for MTCC

/**
 * Fetch all services from Firestore collection 'services'
 */
export async function fetchServicesFromFirestore(): Promise<ServiceItem[]> {
  try {
    const colRef = collection(db, 'services');
    const snapshot = await getDocs(colRef);
    const services: ServiceItem[] = [];
    snapshot.forEach((docSnap) => {
      services.push(docSnap.data() as ServiceItem);
    });
    return services;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'services');
    return [];
  }
}

/**
 * Save or update a single service in Firestore
 */
export async function saveServiceToFirestore(service: ServiceItem): Promise<void> {
  try {
    const docRef = doc(db, 'services', service.id);
    await setDoc(docRef, service, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `services/${service.id}`);
  }
}

/**
 * Delete a service from Firestore
 */
export async function deleteServiceFromFirestore(serviceId: string): Promise<void> {
  try {
    const docRef = doc(db, 'services', serviceId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `services/${serviceId}`);
  }
}

/**
 * Fetch all orders from Firestore collection 'orders'
 */
export async function fetchOrdersFromFirestore(): Promise<ApplicationRecord[]> {
  try {
    const colRef = collection(db, 'orders');
    const snapshot = await getDocs(colRef);
    const orders: ApplicationRecord[] = [];
    snapshot.forEach((docSnap) => {
      orders.push(docSnap.data() as ApplicationRecord);
    });
    return orders;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'orders');
    return [];
  }
}

/**
 * Save a new or existing order to Firestore
 */
export async function saveOrderToFirestore(order: ApplicationRecord): Promise<void> {
  try {
    const docRef = doc(db, 'orders', order.trackingId);
    await setDoc(docRef, order, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `orders/${order.trackingId}`);
  }
}

/**
 * Fetch all Kendras from Firestore collection 'kendras'
 */
export async function fetchKendrasFromFirestore(): Promise<KendraItem[]> {
  try {
    const colRef = collection(db, 'kendras');
    const snapshot = await getDocs(colRef);
    const kendras: KendraItem[] = [];
    snapshot.forEach((docSnap) => {
      kendras.push(docSnap.data() as KendraItem);
    });
    return kendras;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'kendras');
    return [];
  }
}

/**
 * Save Kendra to Firestore
 */
export async function saveKendraToFirestore(kendra: KendraItem): Promise<void> {
  try {
    const docRef = doc(db, 'kendras', kendra.id);
    await setDoc(docRef, kendra, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `kendras/${kendra.id}`);
  }
}
