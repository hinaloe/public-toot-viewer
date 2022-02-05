import InstanceListItem from '@/components/InstanceListItem.vue'
import {mount} from '@vue/test-utils'
import {describe, it, expect} from 'vitest'

describe('Instance list item', () => {
  it('should render Instance list item', () => {
    const instance = {
      "name": "mastodon.xyz",
      "uptime": 0.9322202579083936,
      "up": true,
      "https_score": null,
      "https_rank": null,
      "ipv6": false,
      "openRegistrations": true,
      "users": 23922,
      "statuses": "1651348",
      "connections": 18337,
      "info": {
          "optOut": false,
          "shortDescription": "Generalistic and moderated instance. All opinions are welcome, but hate speeches are prohibited.",
          "fullDescription": "Generalistic and moderated instance. All opinions are welcome, but hate speeches are prohibited.\r\n\r\nUsers who don't respect rules will be silenced, or suspended if they harass other people or if the the violation is considered too large.",
          "theme": null,
          "categories": [],
          "languages": [
              "en",
              "fr",
          ],
          "noOtherLanguages": false,
          "prohibitedContent": [
              "nudity_nocw",
              "pornography_nocw",
              "illegalContentLinks",
              "spam",
          ],
          "otherProhibitedContent": [],
      },
  }

  const wrapper = mount(InstanceListItem, {propsData: {instance}})

  expect(wrapper.html()).toMatchSnapshot()

  expect(wrapper.element.querySelector('.instance-name')?.textContent).to.equal('mastodon.xyz')
  expect(wrapper.html()).not.contains("DOWN")
  expect(wrapper.html()).includes('23922 users / connections: 18337')
  })

  it('should render Instance list item with DOWN status', () => {
    const instance = {
      "name": "physi.cc",
      "uptime": 0.9999999999896647,
      "up": false,
      "https_score": null,
      "https_rank": null,
      "ipv6": null,
      "openRegistrations": null,
      "users": null,
      "statuses": null,
      "connections": null,
  }

  const wrapper = mount(InstanceListItem, {propsData: {instance}})

  expect(wrapper.html()).toMatchSnapshot()

  expect(wrapper.element.querySelector('.instance-name')?.textContent).to.equal('physi.cc')
  expect(wrapper.html()).contains("DOWN")
  expect(wrapper.element.querySelector('b.text-danger')?.textContent?.trim()).to.equal('DOWN')
  })
})
