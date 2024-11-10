import React, { useContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import Sidebar from './sidebar'
import { UserContext } from '~/contexts/UserProvider'

export default function Layout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const { user } = useContext(UserContext);

    useEffect(() => {
        if (!user) {
            router.push("/login");
        }
    }, [user])

    return (
        <>
            {children}
        </>
    )
}

Layout.noSidebar = true