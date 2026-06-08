'use client';
import { getFirebaseAuth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

export function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSignIn = async () => {
        try {
            const auth = getFirebaseAuth();
            await signInWithEmailAndPassword(auth, email, password);
        } catch (e: any) {
            setError(e.message);
        }
    };

    return (
        <Card className="w-[350px] mx-auto mt-10">
            <CardHeader><CardTitle>Sign In</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <Button className="w-full" onClick={handleSignIn}>Sign In</Button>
            </CardContent>
        </Card>
    );
}
