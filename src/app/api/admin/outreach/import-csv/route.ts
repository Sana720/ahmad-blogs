import { NextResponse } from 'next/server';
import admin from '../../../../../utils/firebaseAdmin';
import { db } from '../../../../../utils/firebase';
import { collection, getDocs, query, where, addDoc, Timestamp } from 'firebase/firestore';
import Papa from 'papaparse';

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const token = authHeader.split('Bearer ')[1];
    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(token);
    } catch (e) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { csvData, listId } = body;

    if (!csvData) {
      return NextResponse.json({ error: 'Missing CSV data' }, { status: 400 });
    }

    // Parse CSV
    const parsed = Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) => h.trim(),
    });

    if (parsed.errors.length > 0) {
      console.warn("CSV parse warnings:", parsed.errors);
    }

    const rows = parsed.data as any[];
    
    if (rows.length === 0) {
      return NextResponse.json({ error: 'No data found in CSV' }, { status: 400 });
    }

    let imported = 0;
    let duplicates = 0;
    let invalid = 0;
    const errors: string[] = [];

    // Simple email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Fetch existing emails to prevent duplicates efficiently
    // If the list is huge, we'd need a more robust batching strategy, but this is fine for thousands of rows.
    const allLeadsRef = collection(db, 'outreach_leads');
    const existingSnap = await getDocs(allLeadsRef);
    const existingEmails = new Set(existingSnap.docs.map(d => d.data().email.toLowerCase()));

    const leadsRef = collection(db, 'outreach_leads');

    // Process rows sequentially to avoid overwhelming Firestore (could be batched)
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rawEmail = row.email || row.Email || row.EMAIL;
      
      if (!rawEmail || typeof rawEmail !== 'string') {
        invalid++;
        errors.push(`Row ${i + 1}: Missing email`);
        continue;
      }

      const email = rawEmail.trim().toLowerCase();

      if (!emailRegex.test(email)) {
        invalid++;
        errors.push(`Row ${i + 1}: Invalid email format (${email})`);
        continue;
      }

      if (existingEmails.has(email)) {
        duplicates++;
        // Optionally, we could update the existing lead here, but for now we skip
        continue;
      }

      const newLead = {
        email,
        firstName: row.firstName || row['First Name'] || '',
        lastName: row.lastName || row['Last Name'] || '',
        fullName: row.fullName || row['Full Name'] || '',
        companyName: row.companyName || row['Company'] || '',
        jobTitle: row.jobTitle || row['Job Title'] || '',
        website: row.website || row['Website'] || '',
        industry: row.industry || row['Industry'] || '',
        status: 'New',
        unsubscribeStatus: false,
        listIds: listId ? [listId] : [],
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        source: 'CSV Import',
      };

      try {
        await addDoc(leadsRef, newLead);
        existingEmails.add(email); // Prevent duplicates within the same CSV
        imported++;
      } catch (err: any) {
        console.error(`Failed to insert lead ${email}:`, err);
        errors.push(`Row ${i + 1}: Database error for ${email}`);
      }
    }

    return NextResponse.json({
      success: true,
      summary: {
        total: rows.length,
        imported,
        duplicates,
        invalid,
        errors: errors.slice(0, 100), // Only return first 100 errors to avoid massive payloads
      }
    });

  } catch (error: any) {
    console.error('CSV import error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
