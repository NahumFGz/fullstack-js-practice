import { useEffect, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { social } from '../data/social'
import DevTreeInput from '../components/DevTreeInput'
import { isValidUrl } from '../utils'
import { updateProfile } from '../api/DevTreeAPI'
import { SocialNetwork, User } from '../types'

export default function LinkTreeView() {
  const [devTreeLinks, setDevTreeLinks] = useState(social)
  const queryClient = useQueryClient()
  const user: User = queryClient.getQueryData(['user'])!

  const { mutate } = useMutation({
    mutationFn: updateProfile,
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: () => {
      toast.success('Actualizado Correctamente')
    }
  })

  useEffect(() => {
    const updatedData = devTreeLinks.map((item) => {
      const userlink = JSON.parse(user.links).find((link: SocialNetwork) => link.name === item.name)
      if (userlink) {
        return { ...item, url: userlink.url, enabled: userlink.enabled }
      }
      return item
    })

    setDevTreeLinks(updatedData)
    // eslint-disable-next-line
  }, [])

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedLinks = devTreeLinks.map((link) =>
      link.name === e.target.name ? { ...link, url: e.target.value } : link
    )

    setDevTreeLinks(updatedLinks)

    //! despues de setear, actualizar los datos de client
    /*
    queryClient.setQueryData(['user'], (prevData: User) => {
      return {
        ...prevData,
        links: JSON.stringify(updatedLinks)
      }
    })
      */
  }

  const links: SocialNetwork[] = JSON.parse(user.links)

  const handleEnableLink = (socialNetwork: string) => {
    const updatedLinks = devTreeLinks.map((link) => {
      if (link.name === socialNetwork) {
        if (isValidUrl(link.url)) {
          return { ...link, enabled: !link.enabled }
        } else {
          toast.error('URL no valida')
        }
      }
      return link
    })

    setDevTreeLinks(updatedLinks)

    let updatedItems: SocialNetwork[] = []

    const selectedSocialNetwork = updatedLinks.find((link) => link.name === socialNetwork)
    if (selectedSocialNetwork?.enabled) {
      const id = links.filter((link) => link.id).length + 1

      if (links.some((link) => link.name === socialNetwork)) {
        updatedItems = links.map((link) => {
          if (link.name === socialNetwork) {
            return {
              ...link,
              enabled: true,
              id: id
            }
          } else {
            return link
          }
        })
      } else {
        const newItem = {
          ...selectedSocialNetwork,
          id: id // o poner id o id:id
        }
        updatedItems = [...links, newItem]
      }
    } else {
      //!Si está deshabilitando para evitar que se rompa la muestra del caché
      const indexToUpdate = links.findIndex((link) => link.name === socialNetwork)
      updatedItems = links.map((link) => {
        if (link.name === socialNetwork) {
          return {
            ...link,
            id: 0,
            enabled: false
          }
        } else if (link.id > indexToUpdate && indexToUpdate !== 0 && link.id === 1) {
          return {
            ...link,
            id: link.id - 1
          }
        } else {
          return link
        }
      })
    }

    console.log('---> updatedItems', updatedItems)
    //! despues de setear, actualizar los datos de client
    //* Esto almacena los datos en la caché para luego subirlo a la BD
    queryClient.setQueryData(['user'], (prevData: User) => {
      return {
        ...prevData,
        links: JSON.stringify(updatedItems)
      }
    })
  }

  return (
    <>
      <div className='space-y-5'>
        {devTreeLinks.map((item) => (
          <DevTreeInput
            key={item.name}
            item={item}
            handleUrlChange={handleUrlChange}
            handleEnableLink={handleEnableLink}
          />
        ))}
        <button
          className='bg-cyan-400 p-2 text-lg w-full uppercase text-slate-600 rounded font-bold'
          onClick={() => mutate(queryClient.getQueryData(['user'])!)}
        >
          guardar cambios
        </button>
      </div>
    </>
  )
}
