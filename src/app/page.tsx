import React from 'react'

import { EditProfileSheet } from '@/app/components/EditProfileSheet'
import { Button } from '@/components/ui/button'

import { auth, signOut } from '../../auth'

const Home = async () => {
  const user = await auth().then((res) => res?.user)

  console.table(user)

  return (
    <div>
      <EditProfileSheet />
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
