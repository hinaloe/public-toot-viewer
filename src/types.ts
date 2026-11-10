export type Emoji = {
  shortcode: string
  url: string
  static_url: string
  visible_in_picker: boolean
}

export type Account = {
  id: string
  acct: string
  display_name: string
  url: string
  avatar: string
  header: string
  note: string
  followers_count: number
  following_count: number
  statuses_count: number
  last_status_at?: string | null
  emojis?: Emoji[]
  fields?: { name: string, value: string, verified_at: string | null }[]
  [key: string]: unknown
}

export type MediaAttachment = {
  id: string
  type: string
  url: string
  preview_url: string
  text_url?: string | null
  description?: string | null
  blurhash?: string | null
  meta?: Record<string, unknown>
}

export type Toot = {
  id: string
  url: string
  account: Account
  content: string
  created_at: string
  in_reply_to_id: string | null
  in_reply_to_account_id?: string | null
  reblog: Toot | null
  sensitive: boolean
  spoiler_text: string
  visibility: string
  media_attachments: MediaAttachment[]
  emojis?: Emoji[]
  [key: string]: unknown
}

export type InstanceInfo = {
  name: string
  users: number | null
  connections: number | null
  up: boolean
  [key: string]: unknown
}
