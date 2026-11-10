import TootItem from '@/components/TootItem.vue'
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import type { Toot } from '@/types'

describe('Toot', () => {
  it('should render Toot', () => {
    const toot: Toot = {
      id: '6069779',
      created_at: '2017-04-30T19:37:51.090Z',
      in_reply_to_id: null,
      in_reply_to_account_id: null,
      sensitive: false,
      spoiler_text: '',
      visibility: 'public',
      application: { name: 'Web', website: null },
      account: {
        id: '42621',
        username: 'mikamiyoh',
        acct: 'mikamiyoh',
        display_name: '三上洋',
        locked: false,
        created_at: '2017-04-15T15:01:27.211Z',
        followers_count: 1622,
        following_count: 1679,
        statuses_count: 1307,
        note: '<p>ITジャーナリスト<br />マストドンは島→ <a href="https://news.yahoo.co.jp/byline/mikamiyoh/20170422-00070187/" rel="nofollow noopener" target="_blank"><span class="invisible">https://</span><span class="ellipsis">news.yahoo.co.jp/byline/mikami</span><span class="invisible">yoh/20170422-00070187/</span></a></p>',
        url: 'https://mstdn.jp/@mikamiyoh',
        avatar: 'https://media.mstdn.jp/images/accounts/avatars/000/042/621/original/b2b726b42455ea71.JPG',
        avatar_static: 'https://media.mstdn.jp/images/accounts/avatars/000/042/621/original/b2b726b42455ea71.JPG',
        header: '/headers/original/missing.png',
        header_static: '/headers/original/missing.png',
      },
      media_attachments: [],
      mentions: [],
      tags: [],
      uri: 'tag:mstdn.jp,2017-04-30:objectId=6069779:objectType=Status',
      content: '<p>すまんー。通話できひん。これから鳥キャスするの。</p>',
      url: 'https://mstdn.jp/@mikamiyoh/6069779',
      reblogs_count: 0,
      favourites_count: 0,
      reblog: null,
    }
    const wrapper = mount(TootItem, { props: { toot } })

    expect(wrapper.html()).toMatchSnapshot()

    expect(wrapper.element.querySelector('.toot-header a div')?.textContent)
      .toBe('三上洋 @mikamiyoh')
  })
  it('should hide spoiler content until "Read more..." is clicked', async () => {
    const toot = createToot({
      spoiler_text: 'CW',
      content: '<p>secret</p>',
    })
    const wrapper = mount(TootItem, { props: { toot } })

    expect(wrapper.find('.content').exists()).toBe(false)
    await wrapper.get('button.btn-outline-primary').trigger('click')
    expect(wrapper.get('.content').text()).toBe('secret')
    await wrapper.get('button.btn-outline-secondary').trigger('click')
    expect(wrapper.find('.content').exists()).toBe(false)
  })

  it('should hide sensitive media until clicked', async () => {
    const toot = createToot({
      sensitive: true,
      media_attachments: [{
        id: '1',
        type: 'image',
        url: 'https://example.com/media/1.png',
        preview_url: 'https://example.com/media/1_small.png',
      }],
    })
    const wrapper = mount(TootItem, { props: { toot } })

    expect(wrapper.find('img.img-thumbnail').exists()).toBe(false)
    await wrapper.get('.sensitive').trigger('click')
    expect(wrapper.get('img.img-thumbnail').attributes('src')).toBe('https://example.com/media/1_small.png')
  })

  it('should sanitize content and replace custom emojis', () => {
    const toot = createToot({
      content: '<p>hello :blobcat: <script>alert(1)</script><img src="x" onerror="alert(1)"></p>',
      emojis: [
        { shortcode: 'blobcat', url: 'https://example.com/emoji/blobcat.png', static_url: '', visible_in_picker: true },
        { shortcode: 'bad"code', url: 'https://example.com/emoji/bad.png', static_url: '', visible_in_picker: true },
      ],
    })
    const wrapper = mount(TootItem, { props: { toot } })
    const content = wrapper.get('.content')

    expect(content.find('script').exists()).toBe(false)
    expect(content.html()).not.toContain('onerror')
    expect(content.get('img.inline-emoji').attributes('src')).toBe('https://example.com/emoji/blobcat.png')
    expect(content.findAll('img').length).toBe(1)
  })
})

function createToot (override: Partial<Toot> = {}): Toot {
  return {
    id: '1',
    created_at: '2017-04-30T19:37:51.090Z',
    in_reply_to_id: null,
    sensitive: false,
    spoiler_text: '',
    visibility: 'public',
    account: {
      id: '1',
      acct: 'alice',
      display_name: 'Alice',
      url: 'https://example.com/@alice',
      avatar: 'https://example.com/avatar.png',
      header: '',
      note: '',
      followers_count: 0,
      following_count: 0,
      statuses_count: 0,
    },
    media_attachments: [],
    content: '<p>hello</p>',
    url: 'https://example.com/@alice/1',
    reblog: null,
    ...override,
  }
}
