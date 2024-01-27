import React from 'react'

import { Button } from '@/components/ui/button'
import { auth, signOut } from '../../auth'

const Home = async () => {
  const session = await auth()
  console.table(session)

  if (!session) {
    return null
  }

  return (
    <div>
      <form
        action={async () => {
          'use server'

          await signOut({ redirectTo: '/sign-in' })
        }}
      >
        <Button variant={'ghost'} type="submit">
          Sign Out
        </Button>
      </form>
    </div>
  )
}

export default Home
