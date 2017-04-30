import Vue from 'vue'
import Toot from '@/components/Toot'

describe('Toot', () => {
  it('Toot render', () => {
    const Constructor = Vue.extend(Toot)
    const toot = {
      'id': 6069779,
      'created_at': '2017-04-30T19:37:51.090Z',
      'in_reply_to_id': null,
      'in_reply_to_account_id': null,
      'sensitive': false,
      'spoiler_text': '',
      'visibility': 'public',
      'application': {'name': 'Web', 'website': null},
      'account': {
        'id': 42621,
        'username': 'mikamiyoh',
        'acct': 'mikamiyoh',
        'display_name': '三上洋',
        'locked': false,
        'created_at': '2017-04-15T15:01:27.211Z',
        'followers_count': 1622,
        'following_count': 1679,
        'statuses_count': 1307,
        'note': '<p>ITジャーナリスト<br />マストドンは島→ <a href="https://news.yahoo.co.jp/byline/mikamiyoh/20170422-00070187/" rel="nofollow noopener" target="_blank"><span class="invisible">https://</span><span class="ellipsis">news.yahoo.co.jp/byline/mikami</span><span class="invisible">yoh/20170422-00070187/</span></a></p>',
        'url': 'https://mstdn.jp/@mikamiyoh',
        'avatar': 'https://media.mstdn.jp/images/accounts/avatars/000/042/621/original/b2b726b42455ea71.JPG',
        'avatar_static': 'https://media.mstdn.jp/images/accounts/avatars/000/042/621/original/b2b726b42455ea71.JPG',
        'header': '/headers/original/missing.png',
        'header_static': '/headers/original/missing.png'
      },
      'media_attachments': [],
      'mentions': [],
      'tags': [],
      'uri': 'tag:mstdn.jp,2017-04-30:objectId=6069779:objectType=Status',
      'content': '<p>すまんー。通話できひん。これから鳥キャスするの。</p>',
      'url': 'https://mstdn.jp/@mikamiyoh/6069779',
      'reblogs_count': 0,
      'favourites_count': 0,
      'reblog': null
    }
    const vm = new Constructor({propsData: {toot}}).$mount()
    expect((vm instanceof Vue)).to.equal(true)
    expect(vm.$el.querySelector('.toot-header a div').textContent)
      .to.equal('三上洋 @mikamiyoh')
  })
})
