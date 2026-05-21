import { renderToString } from '@vue/server-renderer'
import { describe, expect, it, vi } from 'vitest'
import { createSSRApp, defineComponent, h } from 'vue'
import Menu from './Menu.vue'

vi.mock('@fizz-layout/components', () => ({
  FlIcon: defineComponent({
    name: 'FlIconStub',
    setup: () => () => null,
  }),
}))

describe('menu', () => {
  it('renders parent menus without path without Vue prop warnings', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})

    const app = createSSRApp({
      render: () => h(Menu, {
        menus: [
          {
            name: 'System',
            children: [
              { name: 'Users', path: '/system/users' },
            ],
          },
        ],
      }),
    })

    await renderToString(app)

    const messages = [
      ...warn.mock.calls.flat(),
      ...error.mock.calls.flat(),
    ].map(String).join('\n')

    expect(messages).not.toContain('Invalid prop')
    expect(messages).not.toContain('Expected String')

    warn.mockRestore()
    error.mockRestore()
  })
})
