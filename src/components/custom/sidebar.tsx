import React, { useContext, useEffect, useState } from 'react'
import { ScrollArea } from "src/components/ui/scroll-area"
import { UserContext } from '~/contexts/UserProvider';
import { Button } from '../ui/button';
import { HomeButton } from './homeButton';
import { apiReq } from '~/utils';
import { useRouter } from 'next/router';

export default function Sidebar() {
  const {user, logout} = useContext(UserContext);

  const router = useRouter();

  const [userHistory, setUserHistory] = useState<any[]>([]);

  const isCurrent = (id: string) => {
    return router.query.presentationId === id;
  }

  useEffect(() => {
    // Fetch user history
    (async () => {
      if (!user) return;
      const response = await apiReq("userHistory", {user});
      if (!response.success) {
        console.error(response.error);
        return;
      }
      setUserHistory(response.contentList);
    })();
  }, [user])

  return (
    <div className="w-64 h-screen bg-white border-r">
      <div className="p-4 w-full justify-center flex">
        <HomeButton/>
      </div>
      <p className="text-lg font-semibold p-4 w-full text-center">Your Past Learnings</p>
      <ScrollArea className="h-[calc(100vh-150px)] ml-2 mr-1">
        {userHistory.map((item, index) => (
          <Button key={index} className={`w-60 mb-2 ${isCurrent(item.courseId) ? "bg-blue-400": ""}`} onClick={() => router.push(`/learn/${item.courseId}`)}>
            <p className="text-sm">{item.title}</p>
          </Button>
        ))}
      </ScrollArea>

      <div className="fixed bottom-0 ml-16 p-4 flex justify-center">
        <Button onClick={logout}>
          Logout
        </Button>
      </div>
    </div>
  )
}