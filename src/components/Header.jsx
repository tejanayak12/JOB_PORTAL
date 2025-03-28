import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Button } from './ui/button'
import { SignedIn, SignedOut, SignIn, SignInButton, UserButton, useUser } from '@clerk/clerk-react'
import { BriefcaseBusiness, Heart, PenBox } from 'lucide-react';

const Header = () => {


    const [showSignIn, setShowSignIn] = useState(false);

    const [search, setSearch] = useSearchParams();

    const user = useUser();

    useEffect(() => {
        if (search.get('sign-in')) {
            setShowSignIn(true);
        }
    }, [search]);

    const handelOverLayoutClick = (e) => {
        if (e.target === e.currentTarget) {
            setShowSignIn(false);
            setSearch({});
        };
    };

    return (
        <>
            <nav className='flex items-center justify-between py-4'>
                <Link>
                    <img src='/logo.png' className='h-20' />
                </Link>


                <div className='flex gap-8'>
                    <SignedOut>
                        <Button variant="outline" onClick={() => setShowSignIn(true)} className='cursor-pointer'>Login</Button>
                    </SignedOut>
                    <SignedIn>
                        {user.isLoaded && user.user?.unsafeMetadata?.role === 'recruiter' && (
                            <Link to='/post-job'>
                                <Button variant='destructive' className='rounded-full'>
                                    <PenBox size={20} />
                                    Post Job
                                </Button>
                            </Link>
                        )}
                        <UserButton appearance={{
                            elements: {
                                avatarBox: "w-10 h-10",
                            }
                        }}
                        >
                            <UserButton.MenuItems>
                                <UserButton.Link
                                    label='My Jobs'
                                    labelIcon={<BriefcaseBusiness size={15} />}
                                    href='my-jobs'
                                />
                                <UserButton.Link
                                    label='Saved Jobs'
                                    labelIcon={<Heart size={15} />}
                                    href='saved-jobs'
                                />
                            </UserButton.MenuItems>
                        </UserButton>
                    </SignedIn>

                </div>
            </nav>

            {showSignIn && (
                <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'
                    onClick={handelOverLayoutClick}
                >
                    <SignIn
                        signUpForceRedirectUrl='/onboarding'
                        fallbackRedirectUrl='/onboarding'
                    />
                </div>)}
        </>
    );
};

export default Header