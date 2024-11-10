{/* <div className='flex flex-row'>
              <Rabbit className="w-10 h-10 text-blue-500" />
              <Rabbit className="w-10 h-10 text-red-500 scale-x-[-1]" />
            </div> */}

import { Rabbit } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export const HomeButton = ({ size = 50 }) => {
    return (
        <div>
            <Link className='flex flex-row' href='/'>
                <Rabbit className="text-blue-500" size={size}/>
                <Rabbit className="text-red-500 scale-x-[-1]" size={size}/>
            </Link>
        </div>
    )
}