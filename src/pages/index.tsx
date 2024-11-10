import React, { useState, useCallback, useContext, useEffect } from 'react'
import { Send, Book, SearchCheckIcon, Rabbit } from 'lucide-react'
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import Sidebar from '~/components/custom/sidebar'
import { useRouter } from 'next/router'
import { UserContext } from '~/contexts/UserProvider'
import Recommendations from '../components/custom/recommendations'
import { apiReq } from '~/utils'
import { HomeButton } from '~/components/custom/homeButton'

export default function Home() {
  const {user} = useContext(UserContext);
  const router = useRouter();
  
  const [prompt, setPrompt] = useState('')

  const handleSubmit = async () => {
    const res = await apiReq("genContent", { user, prompt });
    if(!res.success) {
      console.error(res.error);
      alert('Failed to fetch content');
      return;
    }
    console.log(res);
    router.push(`/learn/${res.presentationId}`);
}

  const handleKeyPress = useCallback((e: { key: string }) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }, [handleSubmit])

  return (
    <div className="flex flex-row h-screen bg-gray-100">
        <Sidebar/>
        <div className="flex flex-1 bg-gray-100 flex-col p-4 justify-center">
            <HomeButton size={100}/>
            
            <h1 className="text-2l font-semibold mb-4">Welcome to</h1>
            <h1 className="text-5xl font-semibold mb-4">NeoMorpheus</h1>
            <h1 className="text-2l font-semibold mb-4">From Novice to Expert: Cybersecurity for All</h1>
            <div className="flex gap-2 mt-4 mb-4 shadow-md bg-white p-4 rounded-lg">
              <Input
                type="text"
                placeholder="Ask a question..."
                value={prompt}
                onKeyDown={handleKeyPress}
                onChange={(e) => setPrompt(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleSubmit}>
                <Send className="w-4 h-4 mr-2" />
                Send
              </Button>
            </div>
            <Recommendations/>
        </div>
    </div>
  )
}