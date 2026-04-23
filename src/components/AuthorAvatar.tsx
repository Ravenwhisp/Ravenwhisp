import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { withBasePath } from '@/lib/paths'

interface AuthorMetadataProps {
  author: string
  avatarFullUrl?: string
}

export const AuthorMetadata = ({ author, avatarFullUrl }: AuthorMetadataProps) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
  }

  return (
    <Avatar className='size-11.5'>
      <AvatarImage src={withBasePath(avatarFullUrl || '/images/avatars/avatar-placeholder.jpg')} alt={author} />
      <AvatarFallback className='text-xs'>{getInitials(author)}</AvatarFallback>
    </Avatar>
  )
}
