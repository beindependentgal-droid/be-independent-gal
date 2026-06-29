'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase-client';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type Step1 = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  password: string;
  confirmPassword: string;
};

type Step2 = {
  profession: string;
  business: string;
  industry: string;
  ageRange: string;
  bio: string;
  passions: string;
  whyJoining: string;
};

export default function SignUpWizard() {
  const router = useRouter();
  const { signUp, signIn, signInWithProvider } = useAuth();
  const supabase = createClient();
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get('email') ?? '';
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailInitialized, setEmailInitialized] = useState(false);
  const passwordRef = useRef<HTMLInputElement | null>(null);

  const [s1, setS1] = useState<Step1>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    password: '',
    confirmPassword: '',
  });

  const [s2, setS2] = useState<Step2>({
    profession: '',
    business: '',
    industry: '',
    ageRange: '',
    bio: '',
    passions: '',
    whyJoining: '',
  });

  const [selectedCircles, setSelectedCircles] = useState<string[]>([]);

  const toggleCircle = (id: string) => {
    setSelectedCircles(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
  };

  const handleStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (s1.password !== s1.confirmPassword) return setError('Passwords do not match');
    if (s1.password.length < 6) return setError('Password must be at least 6 characters');

    setLoading(true);
    try {
      await signUp(s1.email, s1.password);
      try {
        await signIn(s1.email, s1.password);
        setStep(2);
      } catch (signInErr: any) {
        setError(
          signInErr?.message?.includes('confirm') ||
          signInErr?.message?.includes('verify') ||
          signInErr?.message?.includes('verification')
            ? 'Account created. Please verify your email before continuing.'
            : signInErr?.message || 'Account created, but sign in failed. Please try logging in.'
        );
      }
    } catch (err: any) {
      setError(err.message || 'Sign up failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithProvider('google');
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // Save profile data to server via API
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;
      const headers = new Headers({
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      });

      const profileRes = await fetch('/api/auth/profile', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          first_name: s1.firstName,
          last_name: s1.lastName,
          full_name: `${s1.firstName} ${s1.lastName}`,
          phone: s1.phone,
          city: s1.city,
          profession: s2.profession,
          business: s2.business,
          bio: s2.bio,
          avatar_url: '',
          why_joining: s2.whyJoining,
        }),
      });

      if (!profileRes.ok) throw new Error('Failed to save profile');

      const prefRes = await fetch('/api/auth/preferences', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          notifications_enabled: true,
          email_digest: true,
        }),
      });

      if (!prefRes.ok) throw new Error('Failed to save preferences');

      setStep(3);
    } catch (err: any) {
      setError(err.message || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  const handleStep3 = async () => {
    setError('');
    setLoading(true);
    try {
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;
      const headers = new Headers({
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      });

      const circlesRes = await fetch('/api/auth/circles', {
        method: 'POST',
        headers,
        body: JSON.stringify({ selected_circles: selectedCircles }),
      });

      if (!circlesRes.ok) throw new Error('Failed to save circles');

      setStep(4);
    } catch (err: any) {
      setError(err.message || 'Failed to save circles');
    } finally {
      setLoading(false);
    }
  };

  const complete = () => {
    router.push('/community');
  };

  useEffect(() => {
    if (initialEmail && !emailInitialized) {
      setS1((prev) => ({ ...prev, email: initialEmail }));
      setEmailInitialized(true);
      passwordRef.current?.focus();
    }
  }, [initialEmail, emailInitialized]);

  const stepTitles = ['Create Account', 'Your Profile', 'Choose Your Circle', 'Welcome to BIG'];
  const progressPercent = (step / stepTitles.length) * 100;

  return (
    <div className="w-full">
      <div className="mb-8 rounded-2xl border border-border bg-muted/70 p-4">
        <div className="flex items-center justify-between text-sm font-semibold text-secondary-foreground">
          <span>{`Step ${step} of ${stepTitles.length}`}</span>
          <span>{stepTitles[step - 1]}</span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-background">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      {step === 1 && (
        <form onSubmit={handleStep1} className="space-y-4">
          <div className="flex flex-col items-center">
            <Button type="button" variant="secondary" onClick={handleGoogle} className="w-full mb-2 rounded-full">
              Sign up with Google
            </Button>
            <div className="text-sm text-gray-500">or create an account with email</div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" value={s1.firstName} onChange={e => setS1({ ...s1, firstName: e.target.value })} required />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" value={s1.lastName} onChange={e => setS1({ ...s1, lastName: e.target.value })} required />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={s1.email} onChange={e => setS1({ ...s1, email: e.target.value })} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" value={s1.phone} onChange={e => setS1({ ...s1, phone: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="city">County / City</Label>
              <Input id="city" value={s1.city} onChange={e => setS1({ ...s1, city: e.target.value })} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="password">Password</Label>
              <Input ref={passwordRef} id="password" type="password" value={s1.password} onChange={e => setS1({ ...s1, password: e.target.value })} required />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input id="confirmPassword" type="password" value={s1.confirmPassword} onChange={e => setS1({ ...s1, confirmPassword: e.target.value })} required />
            </div>
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <div className="flex justify-between">
            <div />
            <Button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Continue'}</Button>
          </div>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleStep2} className="space-y-4">
          <div>
            <Label htmlFor="profession">Profession</Label>
            <Input id="profession" value={s2.profession} onChange={e => setS2({ ...s2, profession: e.target.value })} />
          </div>

          <div>
            <Label htmlFor="business">Business (Optional)</Label>
            <Input id="business" value={s2.business} onChange={e => setS2({ ...s2, business: e.target.value })} />
          </div>

          <div>
            <Label htmlFor="industry">Industry</Label>
            <Input id="industry" value={s2.industry} onChange={e => setS2({ ...s2, industry: e.target.value })} />
          </div>

          <div>
            <Label htmlFor="ageRange">Age Range</Label>
            <Input id="ageRange" value={s2.ageRange} onChange={e => setS2({ ...s2, ageRange: e.target.value })} />
          </div>

          <div>
            <Label htmlFor="bio">Short Bio</Label>
            <Textarea id="bio" value={s2.bio} onChange={e => setS2({ ...s2, bio: e.target.value })} />
          </div>

          <div>
            <Label htmlFor="passions">What are you passionate about?</Label>
            <Input id="passions" value={s2.passions} onChange={e => setS2({ ...s2, passions: e.target.value })} />
          </div>

          <div>
            <Label htmlFor="whyJoining">Why Are You Joining BIG?</Label>
            <select id="whyJoining" value={s2.whyJoining} onChange={e => setS2({ ...s2, whyJoining: e.target.value })} className="w-full border rounded p-2">
              <option value="">Select a reason</option>
              <option value="learn">To Learn</option>
              <option value="connect">To Connect</option>
              <option value="earn">To Earn</option>
              <option value="thrive">To Thrive</option>
            </select>
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <div className="flex justify-between">
            <Button type="button" variant="secondary" onClick={() => setStep(1)}>Back</Button>
            <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Continue'}</Button>
          </div>
        </form>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold">Choose Your Circle</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button type="button" onClick={() => toggleCircle('learn')} className={`p-4 border rounded ${selectedCircles.includes('learn') ? 'bg-purple-50 border-purple-300' : ''}`}>
              <h4 className="font-semibold">📚 Learn Circle</h4>
              <p className="text-sm text-gray-600">Develop skills, knowledge and confidence.</p>
            </button>

            <button type="button" onClick={() => toggleCircle('connect')} className={`p-4 border rounded ${selectedCircles.includes('connect') ? 'bg-purple-50 border-purple-300' : ''}`}>
              <h4 className="font-semibold">🤝 Connect Circle</h4>
              <p className="text-sm text-gray-600">Build meaningful relationships and networks.</p>
            </button>

            <button type="button" onClick={() => toggleCircle('earn')} className={`p-4 border rounded ${selectedCircles.includes('earn') ? 'bg-purple-50 border-purple-300' : ''}`}>
              <h4 className="font-semibold">💰 Earn Circle</h4>
              <p className="text-sm text-gray-600">Discover opportunities and financial growth.</p>
            </button>

            <button type="button" onClick={() => toggleCircle('thrive')} className={`p-4 border rounded ${selectedCircles.includes('thrive') ? 'bg-purple-50 border-purple-300' : ''}`}>
              <h4 className="font-semibold">❤️ Thrive Circle</h4>
              <p className="text-sm text-gray-600">Focus on wellness, purpose and balanced living.</p>
            </button>
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <div className="flex justify-between">
            <Button type="button" variant="secondary" onClick={() => setStep(2)}>Back</Button>
            <Button type="button" onClick={handleStep2} disabled={loading}>{loading ? 'Finishing...' : 'Finish setup'}</Button>
          </div>
        </div>
      )}
    </div>
  );
}
