import { useContext, useState } from 'react'
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import { Card, CardContent } from "~/components/ui/card"
import { UserContext } from '~/contexts/UserProvider'
import Image from 'next/image'
import { ScrollArea } from '~/components/ui/scroll-area'

type ItemType = 'audio' | 'image'


export default function Home() {
  const {user, logout} = useContext(UserContext)
  const [file, setFile] = useState<File | null>(null)
  const [itemType, setItemType] = useState<ItemType>('audio')
  const [items, setItems] = useState<any[]>([])
  const [selectedItem, setSelectedItem] = useState<any | null>(null)
  const [inputUrl, setInputUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('Uploading...')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0] || null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    setIsLoading(true)

    setTimeout(() => setSubmitMessage("Finding the best matches..."), 2000)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', itemType)
    formData.append('email', user?.email || '')

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      const newItems = data.urls.map((item: any, idx: number) => ({ 
        type: data.return_type, 
        url: item.url, 
        artistInfo: {
          name: item.artist_name,
          email: item.artist_email,
          portfolio: item.artist_portfolio_url, 
        } 
      }))

      setInputUrl(data.input_media_url)

      setItems(newItems)
      console.log(newItems)
      setSelectedItem(null)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const renderForm = () => (
    <div className="flex flex-col h-screen items-center justify-center">
      
    <Image src={`/logo.jpg`} alt='oops' width="256" height="256" className="pt-4" />
    <h2 className="text-2xl font-bold mb-16">Tagline</h2>
      
    <form onSubmit={handleSubmit} className="space-y-4 justify-items-center">
      <Input type="file" onChange={handleFileChange} />
      <Select value={itemType} onValueChange={(value: ItemType) => setItemType(value)}>
        <SelectTrigger>
          <SelectValue placeholder="Select item type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="audio">Music</SelectItem>
          <SelectItem value="image">Image</SelectItem>
        </SelectContent>
      </Select>
      <Button type="submit" disabled={!file || isLoading}>
        {isLoading ? submitMessage : 'Submit'}
      </Button>
    </form>
    </div>
  )

  const renderSidebar = () => (
    <div className="w-64 border-r border-gray-200 h-full overflow-y-auto bg-green-300 h-screen items-center justify-items-center justify-center">
      <Image src={`/logo.jpg`} alt='oops' width="128" height="128" className="pt-4" />
      <h3 className="text-m font-bold">Tagline</h3>
      <h2 className="text-lg font-semibold border-b mt-8 border-gray-200">Recommendations</h2>
      {/* <ul className='h-[30%] bg-blue-300 overflow-scroll  overflow-x-hidden border-2 border-black rounded-xl mx-8 w-[95%] mt-2'> */}
      <ScrollArea className="h-[30%] bg-blue-300">
        {items.map((item, idx) => (
          <li
            key={item.url}
            className={`p-4 cursor-pointer hover:bg-gray-100 w-full ${
              selectedItem?.url === item.url ? 'bg-gray-200' : ''
            }`}
            onClick={() => setSelectedItem(item)}
          >
            {itemType == 'audio' ? "Music" : "Art"} {idx}
          </li>
        ))}
        </ScrollArea>
      {/* </ul> */}
      {selectedItem ? renderArtistInfo(selectedItem.artistInfo) : null}
      <div className="fixed bottom-0 ml-16 p-4 flex justify-center">
        <Button onClick={logout}>
          Logout
        </Button>
      </div>
    </div>
  )

  const renderArtistInfo = (artistInfo: any) => (
    <div className="mt-16">
      <h2 className="text-lg font-semibold">Connect with the artist</h2>
      <p>
        <strong>Name:</strong> {artistInfo.name}
      </p>
      <p>
        <strong>Email:</strong> {artistInfo.email}
      </p>
      <p>
        <strong>Portfolio:</strong> <a href={artistInfo.portfolio}>{artistInfo.portfolio}</a>
      </p>
    </div>
  )

  const renderContent = () => (
    <div className="flex-1 p-0 h-screen">
      {selectedItem ? (
        <Card>
          <CardContent className="p-4 justify-items-center w-full bg-red-500 h-screen">
          <h1 className="text-2xl font-bold mb-4 bg-red-500">{itemType == 'audio' ? "Music" : "Art"} you might like</h1>
            {selectedItem.type === 'audio' ? (
              <>
                <img src={inputUrl} className="h-[85%]" />
                <audio controls src={selectedItem.url}  className='w-full mt-3'/>
              </>
            ) : (
              <>
                <img src={selectedItem.url} className="h-[85%]" />
                <audio controls src={inputUrl} className='w-full mt-3'/>
              </>
            )}
            {/* {renderArtistInfo(selectedItem.artistInfo)} */}
          </CardContent>
        </Card>
      ) : (
        <p className="text-gray-500 text-2xl h-screen w-full text-center mt-[28%]">Select an item from the sidebar to view its content.</p>
      )}
    </div>
  )

  return (
    <div className="container mx-auto p-0">
      {items.length === 0 ? (
        renderForm()
      ) : (
        
        <div className="flex h-[calc(100vh-120px)]">
          {renderSidebar()}
          {renderContent()}
        </div>
      )}
    </div>
  )
}