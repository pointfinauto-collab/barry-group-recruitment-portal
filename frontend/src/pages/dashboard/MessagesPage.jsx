import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, ChevronRight } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function MessagesPage() {
  const [inbox, setInbox] = useState([]);
  const [selected, setSelected] = useState(null);
  const [thread, setThread] = useState([]);
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    api.get('/messages/inbox').then(r => setInbox(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const openThread = async (msg) => {
    setSelected(msg);
    try {
      const res = await api.get(`/messages/${msg.id}/thread`);
      setThread(res.data);
      setInbox(prev => prev.map(m => m.id === msg.id ? { ...m, is_read: true } : m));
    } catch { toast.error('Failed to load thread'); }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!reply.trim()) return;
    setSending(true);
    try {
      await api.post('/messages', {
        recipient_id: selected.sender_id,
        subject: `Re: ${selected.subject}`,
        body: reply,
        parent_id: selected.id,
        application_id: selected.application_id,
      });
      setReply('');
      toast.success('Reply sent!');
      const res = await api.get(`/messages/${selected.id}/thread`);
      setThread(res.data);
    } catch { toast.error('Failed to send reply'); }
    finally { setSending(false); }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display font-bold text-navy-900">Messages</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Inbox */}
        <div className="card overflow-y-auto">
          <h2 className="font-semibold text-navy-900 mb-4">Inbox ({inbox.length})</h2>
          {loading ? (
            <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />)}</div>
          ) : inbox.length === 0 ? (
            <div className="text-center py-10">
              <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">No messages yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {inbox.map(msg => (
                <button key={msg.id} onClick={() => openThread(msg)}
                  className={`w-full text-left p-3 rounded-xl transition-colors border ${selected?.id === msg.id ? 'bg-navy-50 border-navy-300' : 'hover:bg-gray-50 border-transparent'}`}>
                  <div className="flex justify-between items-start mb-1">
                    <span className={`text-sm font-medium ${!msg.is_read ? 'text-navy-900' : 'text-gray-600'}`}>
                      {msg.sender_first} {msg.sender_last}
                    </span>
                    {!msg.is_read && <span className="w-2 h-2 bg-navy-700 rounded-full flex-shrink-0 mt-1" />}
                  </div>
                  <p className={`text-xs truncate ${!msg.is_read ? 'font-semibold text-navy-800' : 'text-gray-500'}`}>{msg.subject}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(msg.created_at).toLocaleDateString()}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Thread */}
        <div className="lg:col-span-2 card flex flex-col overflow-hidden">
          {!selected ? (
            <div className="flex-1 flex items-center justify-center text-center">
              <div>
                <MessageSquare className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-400">Select a message to read</p>
              </div>
            </div>
          ) : (
            <>
              <div className="border-b border-gray-100 pb-4 mb-4">
                <h3 className="font-semibold text-navy-900">{selected.subject}</h3>
                {selected.application_number && (
                  <p className="text-xs text-gray-400">Application: {selected.application_number}</p>
                )}
              </div>
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {thread.map(msg => (
                  <div key={msg.id} className={`flex ${msg.sender_id !== selected.sender_id ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md p-4 rounded-2xl text-sm ${msg.sender_id !== selected.sender_id ? 'bg-navy-800 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
                      <p className="font-medium text-xs mb-1 opacity-70">{msg.sender_first} {msg.sender_last}</p>
                      <p className="leading-relaxed">{msg.body}</p>
                      <p className={`text-xs mt-2 opacity-60`}>{new Date(msg.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={handleReply} className="flex gap-3 pt-4 border-t border-gray-100">
                <textarea rows={2} value={reply} onChange={e => setReply(e.target.value)}
                  placeholder="Write your reply..." className="input-field resize-none flex-1 text-sm py-2" />
                <button type="submit" disabled={sending || !reply.trim()} className="btn-primary self-end px-4 py-2">
                  {sending ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
