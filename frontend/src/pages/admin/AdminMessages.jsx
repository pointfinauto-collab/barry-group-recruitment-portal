import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, Search, X } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function AdminMessages() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ subject: '', body: '' });
  const [sending, setSending] = useState(false);
  const [inbox, setInbox] = useState([]);
  const [thread, setThread] = useState([]);
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [replyBody, setReplyBody] = useState('');

  useEffect(() => {
    api.get('/messages/inbox').then(r => setInbox(r.data)).catch(() => {});
    api.get('/admin/users?limit=50').then(r => setUsers(r.data.users || [])).catch(() => {});
  }, []);

  const filteredUsers = users.filter(u =>
    `${u.first_name} ${u.last_name} ${u.email}`.toLowerCase().includes(search.toLowerCase())
  );

  const handleSend = async (e) => {
    e.preventDefault();
    if (!selected) { toast.error('Select a recipient'); return; }
    setSending(true);
    try {
      await api.post('/messages', { recipient_id: selected.id, subject: form.subject, body: form.body });
      toast.success('Message sent!');
      setForm({ subject: '', body: '' });
      setSelected(null);
    } catch { toast.error('Send failed'); }
    finally { setSending(false); }
  };

  const openThread = async (msg) => {
    setSelectedMsg(msg);
    try {
      const res = await api.get(`/messages/${msg.id}/thread`);
      setThread(res.data);
    } catch {}
  };

  const sendReply = async (e) => {
    e.preventDefault();
    if (!replyBody.trim()) return;
    try {
      await api.post('/messages', {
        recipient_id: selectedMsg.sender_id,
        subject: `Re: ${selectedMsg.subject}`,
        body: replyBody,
        parent_id: selectedMsg.id,
      });
      setReplyBody('');
      toast.success('Reply sent!');
      const res = await api.get(`/messages/${selectedMsg.id}/thread`);
      setThread(res.data);
    } catch { toast.error('Failed'); }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display font-bold text-navy-900">Messaging Center</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Send new message */}
        <div className="card">
          <h2 className="font-semibold text-navy-900 mb-4 flex items-center gap-2"><Send className="w-5 h-5 text-navy-600" />Send Message to Applicant</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Search Applicant</label>
            <input type="text" placeholder="Search by name or email..." value={search}
              onChange={e => setSearch(e.target.value)} className="input-field mb-2" />
            {search && (
              <div className="border border-gray-200 rounded-xl max-h-40 overflow-y-auto">
                {filteredUsers.slice(0, 8).map(u => (
                  <button key={u.id} onClick={() => { setSelected(u); setSearch(''); }}
                    className="w-full text-left px-4 py-2.5 hover:bg-gray-50 border-b last:border-0 text-sm">
                    <span className="font-medium text-navy-800">{u.first_name} {u.last_name}</span>
                    <span className="text-gray-400 ml-2">{u.email}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          {selected && (
            <div className="flex items-center gap-2 px-3 py-2 bg-navy-50 rounded-lg mb-4">
              <span className="text-sm font-medium text-navy-800">To: {selected.first_name} {selected.last_name}</span>
              <button onClick={() => setSelected(null)} className="ml-auto text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
            </div>
          )}
          <form onSubmit={handleSend} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject</label>
              <input required value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} placeholder="Message subject..." className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
              <textarea required rows={5} value={form.body} onChange={e => setForm(p => ({ ...p, body: e.target.value }))} placeholder="Write your message..." className="input-field resize-none" />
            </div>
            <button type="submit" disabled={sending || !selected} className="btn-primary w-full justify-center">
              {sending ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Send className="w-5 h-5" />Send Message</>}
            </button>
          </form>
        </div>

        {/* Inbox */}
        <div className="card flex flex-col" style={{ minHeight: '500px' }}>
          {!selectedMsg ? (
            <>
              <h2 className="font-semibold text-navy-900 mb-4">Admin Inbox ({inbox.length})</h2>
              {inbox.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-center">
                  <div><MessageSquare className="w-12 h-12 text-gray-200 mx-auto mb-3" /><p className="text-gray-400 text-sm">No messages</p></div>
                </div>
              ) : (
                <div className="space-y-2 overflow-y-auto flex-1">
                  {inbox.map(msg => (
                    <button key={msg.id} onClick={() => openThread(msg)}
                      className={`w-full text-left p-3 rounded-xl border transition-colors hover:bg-gray-50 ${!msg.is_read ? 'border-navy-200 bg-blue-50' : 'border-transparent'}`}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-navy-800">{msg.sender_first} {msg.sender_last}</span>
                        {!msg.is_read && <span className="w-2 h-2 bg-navy-700 rounded-full" />}
                      </div>
                      <p className="text-xs text-gray-500 truncate">{msg.subject}</p>
                      <p className="text-xs text-gray-400 mt-1">{new Date(msg.created_at).toLocaleDateString()}</p>
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              <div className="flex justify-between items-center mb-4 border-b pb-4">
                <div>
                  <h3 className="font-semibold text-navy-900">{selectedMsg.subject}</h3>
                  <p className="text-xs text-gray-400">From: {selectedMsg.sender_first} {selectedMsg.sender_last}</p>
                </div>
                <button onClick={() => setSelectedMsg(null)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
              </div>
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {thread.map(msg => (
                  <div key={msg.id} className={`p-3 rounded-xl text-sm ${msg.sender_first === 'Barry' ? 'bg-navy-50 border-l-4 border-navy-400' : 'bg-gray-50'}`}>
                    <p className="text-xs font-medium text-gray-500 mb-1">{msg.sender_first} {msg.sender_last} • {new Date(msg.created_at).toLocaleString()}</p>
                    <p className="text-gray-800 leading-relaxed">{msg.body}</p>
                  </div>
                ))}
              </div>
              <form onSubmit={sendReply} className="flex gap-3 border-t pt-4">
                <textarea rows={2} value={replyBody} onChange={e => setReplyBody(e.target.value)} placeholder="Reply..." className="input-field resize-none flex-1 text-sm py-2" />
                <button type="submit" disabled={!replyBody.trim()} className="btn-primary self-end px-4 py-2">
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
