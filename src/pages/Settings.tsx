import { useEffect, useState, FormEvent } from 'react';
import { User, Mail, Save, Lock, AlertCircle } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export default function Settings() {
  const { user } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (!user) return;
    setEmail(user.email || '');
    setFullName((user.user_metadata?.full_name as string) || '');
  }, [user]);

  const handleProfileSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    const updates: Record<string, unknown> = {};

    const { error: authError } = await supabase.auth.updateUser({
      data: { full_name: fullName },
    });

    if (email !== user?.email) {
      const { error: emailError } = await supabase.auth.updateUser({ email });
      if (emailError) {
        setError(emailError.message);
        setSaving(false);
        return;
      }
      updates.email_updated = true;
    }

    await supabase.from('profiles').upsert({
      id: user!.id,
      name: fullName,
      email: email,
    });

    await supabase.from('users').upsert({
      id: user!.id,
      full_name: fullName,
      email: email,
    });

    if (authError) {
      setError(authError.message);
    } else {
      setSuccess('Profile updated successfully!');
      if (updates.email_updated) {
        setSuccess('Profile updated! Check your new email for a confirmation link.');
      }
    }

    setSaving(false);
  };

  const handlePasswordChange = async (e: FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }

    setSavingPassword(true);

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setPasswordError(error.message);
    } else {
      setPasswordSuccess('Password updated successfully!');
      setNewPassword('');
      setConfirmPassword('');
    }

    setSavingPassword(false);
  };

  const initials = (fullName || user?.email || 'U')
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <AppLayout title="Settings">
      <div className="max-w-2xl space-y-6 w-full">
        <div className="card w-full">
          <div className="flex items-center gap-4 mb-6">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-semibold font-heading"
              style={{ background: 'rgba(211,150,140,0.18)', color: '#D3968C' }}
            >
              {initials}
            </div>
            <div>
              <h2 className="font-heading text-lg font-semibold" style={{ color: '#F7F4D5' }}>{fullName || 'Your Profile'}</h2>
              <p className="text-sm font-body" style={{ color: 'rgba(247,244,213,0.55)' }}>{user?.email}</p>
            </div>
          </div>

          <form onSubmit={handleProfileSave} className="space-y-4">
            <h3 className="font-heading text-base font-semibold flex items-center gap-2" style={{ color: '#F7F4D5' }}>
              <User className="w-4 h-4" style={{ color: '#D3968C' }} />
              Profile Information
            </h3>

            {success && (
              <div
                className="p-3 rounded-xl text-sm font-body"
                style={{ background: 'rgba(131,153,88,0.15)', border: '1px solid rgba(131,153,88,0.25)', color: '#839958' }}
              >
                {success}
              </div>
            )}
            {error && (
              <div
                className="p-3 rounded-xl text-sm font-body flex items-center gap-2"
                style={{ background: 'rgba(211,150,140,0.15)', border: '1px solid rgba(211,150,140,0.25)', color: '#D3968C' }}
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-body font-medium mb-1.5" style={{ color: 'rgba(247,244,213,0.75)' }}>Full name</label>
              <input
                type="text"
                className="input-field"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-body font-medium mb-1.5" style={{ color: 'rgba(247,244,213,0.75)' }}>
                <Mail className="w-3.5 h-3.5 inline mr-1" />
                Email address
              </label>
              <input
                type="email"
                className="input-field"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
              />
              {email !== user?.email && (
                <p className="text-xs font-body mt-1" style={{ color: '#D3968C' }}>You'll need to confirm your new email address.</p>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button type="submit" disabled={saving} className="btn-primary">
                {saving ? (
                  <span className="flex items-center gap-2">
                    <span
                      className="rounded-full animate-spin"
                      style={{ width: '16px', height: '16px', display: 'inline-block', border: '2px solid rgba(10,51,35,0.30)', borderTopColor: '#0A3323' }}
                    />
                    Saving...
                  </span>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="card">
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <h3 className="font-heading text-base font-semibold flex items-center gap-2" style={{ color: '#F7F4D5' }}>
              <Lock className="w-4 h-4" style={{ color: '#D3968C' }} />
              Change Password
            </h3>

            {passwordSuccess && (
              <div
                className="p-3 rounded-xl text-sm font-body"
                style={{ background: 'rgba(131,153,88,0.15)', border: '1px solid rgba(131,153,88,0.25)', color: '#839958' }}
              >
                {passwordSuccess}
              </div>
            )}
            {passwordError && (
              <div
                className="p-3 rounded-xl text-sm font-body flex items-center gap-2"
                style={{ background: 'rgba(211,150,140,0.15)', border: '1px solid rgba(211,150,140,0.25)', color: '#D3968C' }}
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {passwordError}
              </div>
            )}

            <div>
              <label className="block text-sm font-body font-medium mb-1.5" style={{ color: 'rgba(247,244,213,0.75)' }}>New password</label>
              <input
                type="password"
                className="input-field"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Min. 8 characters"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-body font-medium mb-1.5" style={{ color: 'rgba(247,244,213,0.75)' }}>Confirm new password</label>
              <input
                type="password"
                className="input-field"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                required
              />
            </div>

            <div className="flex justify-end pt-2">
              <button type="submit" disabled={savingPassword} className="btn-primary">
                {savingPassword ? (
                  <span className="flex items-center gap-2">
                    <span
                      className="rounded-full animate-spin"
                      style={{ width: '16px', height: '16px', display: 'inline-block', border: '2px solid rgba(10,51,35,0.30)', borderTopColor: '#0A3323' }}
                    />
                    Updating...
                  </span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Update password
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="card w-full" style={{ borderColor: 'rgba(196,131,122,0.20)' }}>
          <h3 className="font-heading text-base font-semibold mb-3" style={{ color: '#F7F4D5' }}>Account Information</h3>
          <div className="space-y-2 text-sm font-body" style={{ color: 'rgba(247,244,213,0.65)' }}>
            <div className="flex justify-between py-2" style={{ borderBottom: '1px solid rgba(247,244,213,0.08)' }}>
              <span>User ID</span>
              <span className="font-mono text-xs" style={{ color: 'rgba(247,244,213,0.45)' }}>{user?.id?.slice(0, 16)}...</span>
            </div>
            <div className="flex justify-between py-2" style={{ borderBottom: '1px solid rgba(247,244,213,0.08)' }}>
              <span>Account created</span>
              <span style={{ color: 'rgba(247,244,213,0.45)' }}>
                {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span>Last sign in</span>
              <span style={{ color: 'rgba(247,244,213,0.45)' }}>
                {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
