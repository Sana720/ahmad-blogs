"use client";

import AdminLayout from '../../../../components/admin/AdminLayout';
import RequireAuth from '../../../../components/admin/RequireAuth';
import { useState, useRef } from 'react';
import Papa from 'papaparse';
import { getAuth } from 'firebase/auth';

export default function QuickSendPage() {
  const [file, setFile] = useState<File | null>(null);
  const [subject, setSubject] = useState('Secure Your Browsing at {{companyName}} with Chrome Profile Lock');
  
  const defaultEmail = `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6; padding: 20px;">
  <p style="font-size: 16px;">Hi {{firstName}},</p>
  <p style="font-size: 16px;">Whether you use a shared computer, work in a busy office at <strong>{{companyName}}</strong>, or simply want more privacy, keeping your browsing data secure is essential.</p>
  
  <p style="font-size: 16px;">I wanted to introduce you to <strong><a href="{{productUrl}}" style="color: #3CB371; text-decoration: none; font-weight: bold;">Google Chrome Profile Lock</a></strong> – a powerful, lightweight extension that password-protects your Chrome browser and secures your privacy.</p>
  
  <h3 style="color: #232946; margin-top: 24px; border-bottom: 2px solid #eaf0f6; padding-bottom: 8px;">Key Security Features</h3>
  <ul style="font-size: 15px; color: #555;">
    <li style="margin-bottom: 8px;"><strong>100% Offline Security:</strong> No cloud servers, no account required. Your data stays safely on your device.</li>
    <li style="margin-bottom: 8px;"><strong>Instant & Auto Lock:</strong> Lock with one click (Cmd+Shift+L), or auto-lock after 5 minutes of inactivity.</li>
    <li style="margin-bottom: 8px;"><strong>Anti-Tamper & Brute-Force Defense:</strong> Prevents unauthorized uninstalls and locks down after 5 failed attempts.</li>
    <li style="margin-bottom: 8px;"><strong>Easy Password Reset:</strong> Recover access safely via personal security questions without complex secret keys.</li>
  </ul>
  
  <div style="text-align: center; margin: 35px 0;">
    <a href="{{productUrl}}" style="background-color: #3CB371; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 6px rgba(60, 179, 113, 0.2);">Try Profile Lock for Free</a>
  </div>

  <div style="background-color: #f9fbfd; border: 1px solid #eaf0f6; border-radius: 8px; padding: 20px; margin-top: 30px;">
    <h4 style="color: #232946; margin-top: 0; font-size: 16px;">🚀 Unlock Advanced Protection with PRO</h4>
    <p style="font-size: 14px; margin-bottom: 10px;">Upgrade to <strong>Profile Lock PRO</strong> for custom auto-lock timers, security activity logs (intruder alerts), and website-specific protection (lock Gmail, company dashboards, banking).</p>
    <p style="font-size: 14px; margin-bottom: 0;"><strong>Exclusive Offer for {{companyName}}:</strong> Use coupon code <strong style="color: #3CB371; background: #e8f5e9; padding: 2px 6px; border-radius: 4px;">PRO20</strong> at checkout for a discounted price!</p>
  </div>
  
  <p style="font-size: 15px; margin-top: 30px;">Best regards,<br><strong style="color: #232946;">AhmadBlogs Team</strong></p>
</div>
`.trim();

  const [htmlBody, setHtmlBody] = useState(defaultEmail);
  const [status, setStatus] = useState<'idle' | 'parsing' | 'sending' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDownloadTemplate = () => {
    const csvContent = "email,firstName,lastName,companyName\njohn@example.com,John,Doe,Example Corp\n";
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'outreach_leads_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const [googleSheetUrl, setGoogleSheetUrl] = useState('');

  const handleSend = async () => {
    if ((!file && !googleSheetUrl) || !subject || !htmlBody) {
      alert("Please provide a CSV file OR a Google Sheet URL, along with a Subject and HTML Body.");
      return;
    }

    setStatus('parsing');
    setProgress('Parsing leads...');

    const processResults = async (results: any) => {
        const rows = results.data as any[];
        
        // Filter valid rows
        const validLeads = rows.filter(r => {
          const email = r.email || r.Email || r.EMAIL;
          return email && email.includes('@');
        }).map(r => ({
          email: (r.email || r.Email || r.EMAIL).trim().toLowerCase(),
          firstName: r.firstName || r['First Name'] || '',
          lastName: r.lastName || r['Last Name'] || '',
          companyName: r.companyName || r['Company'] || '',
        }));

        if (validLeads.length === 0) {
          setStatus('error');
          setProgress('No valid email addresses found. Make sure you have an "email" column.');
          return;
        }

        setStatus('sending');
        setProgress(`Sending emails to ${validLeads.length} leads... This may take a moment.`);

        try {
          const auth = getAuth();
          const user = auth.currentUser;
          if (!user) throw new Error("Not authenticated");
          const token = await user.getIdToken();

          const response = await fetch('/api/admin/outreach/quick-send', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              leads: validLeads,
              subject,
              htmlBody
            })
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || 'Failed to send emails');
          }

          setStatus('success');
          setProgress(`Successfully processed! Sent: ${data.summary.sent}, Failed: ${data.summary.failed}, Skipped (Suppressed/Duplicates): ${data.summary.skipped}`);
          setFile(null);
          setGoogleSheetUrl('');
          if (fileInputRef.current) fileInputRef.current.value = '';
        } catch (error: any) {
          console.error("Error sending:", error);
          setStatus('error');
          setProgress(`Error: ${error.message}`);
        }
    };

    if (googleSheetUrl) {
       let fetchUrl = googleSheetUrl;
       if (fetchUrl.includes('/edit')) {
         fetchUrl = fetchUrl.replace(/\/edit.*$/, '/export?format=csv');
       }
       
       Papa.parse(fetchUrl, {
          download: true,
          header: true,
          skipEmptyLines: true,
          complete: processResults,
          error: (err) => {
             setStatus('error');
             setProgress('Failed to fetch Google Sheet. Make sure the sheet is set to "Anyone with the link can view".');
          }
       });
    } else if (file) {
       Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: processResults
       });
    }
  };

  return (
    <RequireAuth>
      <AdminLayout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-[#232946] tracking-tight">Quick Send (Simple Blast)</h1>
            <p className="mt-2 text-sm text-gray-500">Upload a CSV, write your email, and blast it out immediately.</p>
          </div>

          <div className="bg-white shadow rounded-lg p-6 border border-[#eaf0f6] space-y-6">
            
            {/* Step 1: Data Source */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-bold text-gray-900">1. Data Source (CSV or Google Sheet)</h3>
                <button 
                  onClick={handleDownloadTemplate}
                  className="text-sm text-[#3CB371] hover:text-[#329960] font-medium flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                  Download Template
                </button>
              </div>
              <p className="text-xs text-gray-500 mb-4">Must contain an <strong>email</strong> column. Optional columns: <strong>firstName</strong>, <strong>companyName</strong>.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Option A: Upload CSV File</label>
                  <input 
                    type="file" 
                    accept=".csv"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#eaf0f6] file:text-[#232946] hover:file:bg-gray-200"
                  />
                </div>
                
                <div className="border border-gray-200 rounded-md p-4 bg-gray-50 flex flex-col justify-center">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Option B: Public Google Sheet URL</label>
                  <input 
                    type="text" 
                    value={googleSheetUrl}
                    onChange={(e) => setGoogleSheetUrl(e.target.value)}
                    placeholder="https://docs.google.com/spreadsheets/d/..."
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#3CB371] focus:ring-[#3CB371] px-3 py-2 border text-gray-900 text-sm"
                  />
                  <p className="text-[10px] text-gray-500 mt-1">Make sure the sheet share setting is "Anyone with the link can view".</p>
                </div>
              </div>
            </div>

            <hr />

            {/* Step 2: Email Content */}
            <div>
              <h3 className="text-lg font-bold mb-2 text-gray-900">2. Email Content</h3>
              <p className="text-xs text-gray-500 mb-4">You can use variables: <code>{'{{firstName}}'}</code>, <code>{'{{companyName}}'}</code></p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Subject</label>
                  <input 
                    type="text" 
                    value={subject} 
                    onChange={e => setSubject(e.target.value)} 
                    placeholder="Quick question for {{companyName}}"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#3CB371] focus:ring-[#3CB371] px-4 py-2 border text-gray-900" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">HTML Body</label>
                  <textarea 
                    value={htmlBody} 
                    onChange={e => setHtmlBody(e.target.value)} 
                    rows={20}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#3CB371] focus:ring-[#3CB371] px-4 py-2 border font-mono text-sm text-gray-900" 
                  />
                </div>
              </div>
            </div>

            <hr />

            {/* Step 3: Send */}
            <div>
              {status !== 'idle' && (
                <div className={`mb-4 p-4 rounded-md ${status === 'success' ? 'bg-green-50 text-green-800' : status === 'error' ? 'bg-red-50 text-red-800' : 'bg-blue-50 text-blue-800'}`}>
                  {progress}
                </div>
              )}
              
              <button 
                onClick={handleSend}
                disabled={status === 'parsing' || status === 'sending'}
                className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-[#3CB371] hover:bg-[#329960] focus:outline-none disabled:opacity-50"
              >
                {status === 'parsing' || status === 'sending' ? 'Processing...' : '🚀 Send Blast Now'}
              </button>
            </div>

          </div>
        </div>
      </AdminLayout>
    </RequireAuth>
  );
}
