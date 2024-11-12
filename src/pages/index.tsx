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
import { Brush, Link, Link2, Music, SquareArrowOutUpRight } from 'lucide-react'

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

    setTimeout(() => setSubmitMessage("Finding the best matches..."), 4000)

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
        title: item.title,
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
    <div className="flex flex-col h-screen items-center justify-center bg-cover">
      
    <Image src={`/logo.png`} alt='oops' width="300" height="300" />
      
    <form onSubmit={handleSubmit} className="space-y-4 justify-items-center">
      <h2 className='w-full font-bold left-0'>Upload your art</h2>
      <Input type="file" onChange={handleFileChange} />

      <h3 className='w-full font-bold left-0'>Amplify with</h3>
      <Select value={itemType} onValueChange={(value: ItemType) => setItemType(value)}>
        <SelectTrigger>
          <SelectValue placeholder="Select item type" />
        </SelectTrigger>
          <SelectContent>
            <SelectItem value="audio">Music</SelectItem>
            <SelectItem value="image">Image</SelectItem>
          </SelectContent>
      </Select>
      <div className="flex flex-row justify-between space-x-[250px] mt-16">
        <Button onClick={logout}>
          Logout
        </Button>
      <Button type="submit" disabled={!file || isLoading} >
        {isLoading ? submitMessage : 'Submit'}
      </Button>
      </div>
    </form>
      
    </div>
  )

  const renderSidebar = () => (
    <div className="w-64 border-r border-gray-200 h-full overflow-x-hidden overflow-y-auto h-screen items-center justify-items-center justify-center">
      <Image src={`/logo.png`} alt='oops' width="128" height="128" className="pt-4 rounded-xl" />
      <h2 className="text-xl font-semibold border-b mb-4 border-gray-200">Recommendations</h2>
      <ScrollArea className="h-[30%] w-[90%] bg-gray-100 rounded-xl">
        {items.map((item, idx) => (
          <p
            key={item.url}
            className={`p-4 cursor-pointer hover:bg-gray-100 w-full text-center flex flex-row truncate ${
              selectedItem?.url === item.url ? 'bg-gray-200' : ''
            }`}
            onClick={() => setSelectedItem(item)}
          >
            {itemType == 'audio' ? <Music className='mr-2'/> : <Brush className='mr-2'/>} <p>{item.title}</p>
          </p>
        ))}
        </ScrollArea>
      {selectedItem ? renderArtistInfo(selectedItem.artistInfo) : null}
      <div className="fixed bottom-0 ml-16 p-4 flex justify-center">
        <Button onClick={logout}>
          Logout
        </Button>
      </div>
    </div>
  )

  const renderArtistInfo = (artistInfo: any) => (
    <div className="mt-16 w-[90%] overflow-hidden ml-4 mr-4">
      <a href={artistInfo.portfolio} target='_blank'><h2 className="text-lg font-semibold underline ">Connect with the artist</h2></a>
      <p>
        <strong>Name:</strong> {artistInfo.name}
      </p>
      <p>
        <strong>Email:</strong> {artistInfo.email}
      </p>
      {/* <p className='flex flex-row underline justify-center items-center text-blue-500 my-2'>
      <a href={artistInfo.portfolio} target='_blank'><strong >Portfolio</strong> </a>
      </p> */}
    </div>
  )

  const renderContent = () => (
    <div className="flex-1 p-0 h-screen ">
      {selectedItem ? (
        <Card>
          <CardContent className="p-4 justify-items-center w-full h-screen ">
            <div className='flex align-text-bottom'>
          <h2 className="text-2xl font-bold mb-4 mt-2 align-bottom">{itemType == 'audio' ? "Music" : "Art"} you might like:</h2><h1 className="text-2xl ml-3 font-bold mt-2 mb-4">{selectedItem.title}</h1>
          </div>
            {selectedItem.type === 'audio' ? (
              <>
                <img src={inputUrl} className="h-[80%] rounded-xl" />
                <audio controls src={selectedItem.url}  className='w-full mt-6 '/>
              </>
            ) : (
              <>
                <img src={selectedItem.url} className="h-[80%] rounded-xl" />
                <audio controls src={inputUrl} className='w-full mt-6'/>
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <p className="text-gray-500 text-2xl h-screen w-full text-center mt-[28%]">Select an item from the sidebar to view its content.</p>
      )}
    </div>
  )

  return (
    <div className="container mx-auto p-0 overflow-hidden h-screen">
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