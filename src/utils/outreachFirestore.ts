import { db } from './firebase';
import { collection, doc, getDoc, getDocs, setDoc, addDoc, updateDoc, deleteDoc, query, where, orderBy, limit, DocumentData, Timestamp } from 'firebase/firestore';

export interface Lead {
  id?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  companyName?: string;
  jobTitle?: string;
  website?: string;
  industry?: string;
  companySize?: string;
  country?: string;
  state?: string;
  city?: string;
  source?: string;
  notes?: string;
  tags?: string[];
  status: 'New' | 'Ready' | 'Contacted' | 'Replied' | 'Interested' | 'Not Interested' | 'Converted' | 'Unsubscribed' | 'Invalid' | 'Do Not Contact';
  unsubscribeStatus: boolean;
  listIds?: string[]; // IDs of lists this lead belongs to
  createdAt: any;
  updatedAt: any;
  lastContactedAt?: any;
}

export interface OutreachList {
  id?: string;
  name: string;
  description?: string;
  createdAt: any;
  updatedAt: any;
}

export interface Campaign {
  id?: string;
  name: string;
  description?: string;
  listId: string;
  templateId: string;
  status: 'Draft' | 'Scheduled' | 'Sending' | 'Paused' | 'Completed' | 'Cancelled' | 'Failed';
  scheduledAt?: any;
  createdAt: any;
  startedAt?: any;
  completedAt?: any;
  createdBy?: string;
}

export interface Template {
  id?: string;
  name: string;
  subject: string;
  htmlBody: string;
  textBody: string;
  category?: string;
  createdAt: any;
  updatedAt: any;
}

export interface Suppression {
  id?: string;
  email: string;
  reason: 'Unsubscribed' | 'Complaint' | 'Permanent Bounce' | 'Manual Do Not Contact';
  source?: string;
  createdAt: any;
}

export interface EmailLog {
  id?: string;
  campaignId: string;
  leadId: string;
  recipientEmail: string;
  subject: string;
  status: 'Queued' | 'Sent' | 'Delivered' | 'Clicked' | 'Bounced' | 'Failed' | 'Complained' | 'Unsubscribed';
  providerMessageId?: string;
  eventType: string;
  sentAt?: any;
  deliveredAt?: any;
  clickedAt?: any;
  bouncedAt?: any;
  failedAt?: any;
  errorMessage?: string;
  createdAt: any;
}

export interface Settings {
  id?: string;
  businessName?: string;
  senderName?: string;
  senderEmail?: string;
  replyToEmail?: string;
  businessAddress?: string;
  defaultEmailsPerMinute?: number;
  dailySendLimit?: number;
  campaignRecipientLimit?: number;
  defaultFollowUpDelay?: number;
  defaultProductUrl?: string;
  defaultDiscountCode?: string;
  unsubscribeFooter?: string;
}

// ----- LEADS -----
export const getLeads = async (): Promise<Lead[]> => {
  const q = query(collection(db, 'outreach_leads'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lead));
};

export const getLeadByEmail = async (email: string): Promise<Lead | null> => {
  const q = query(collection(db, 'outreach_leads'), where('email', '==', email.toLowerCase()));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Lead;
};

export const addLead = async (leadData: Omit<Lead, 'createdAt' | 'updatedAt'>) => {
  const lead = {
    ...leadData,
    email: leadData.email.toLowerCase(),
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
  const docRef = await addDoc(collection(db, 'outreach_leads'), lead);
  return docRef.id;
};

// ----- SUPPRESSION -----
export const getSuppressions = async (): Promise<Suppression[]> => {
  const q = query(collection(db, 'outreach_suppressions'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Suppression));
};

export const isSuppressed = async (email: string): Promise<boolean> => {
  const q = query(collection(db, 'outreach_suppressions'), where('email', '==', email.toLowerCase()));
  const snapshot = await getDocs(q);
  return !snapshot.empty;
};

export const addSuppression = async (email: string, reason: Suppression['reason'], source?: string) => {
  const suppressed = await isSuppressed(email);
  if (suppressed) return;
  await addDoc(collection(db, 'outreach_suppressions'), {
    email: email.toLowerCase(),
    reason,
    source,
    createdAt: Timestamp.now(),
  });
};

// ----- SETTINGS -----
export const getSettings = async (): Promise<Settings | null> => {
  const docRef = doc(db, 'outreach_settings', 'global');
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Settings;
  }
  return null;
};

export const updateSettings = async (settingsData: Partial<Settings>) => {
  const docRef = doc(db, 'outreach_settings', 'global');
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    await updateDoc(docRef, settingsData);
  } else {
    await setDoc(docRef, settingsData);
  }
};
