import { renderToString } from '@vue/server-renderer'
import { describe, expect, it, vi } from 'vitest'
import { createApp, createSSRApp, defineComponent, h, nextTick } from 'vue'
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

  it('emits select once when clicking a menu item', async () => {
    const onSelect = vi.fn()
    const root = document.createElement('div')
    document.body.appendChild(root)

    const app = createApp({
      render: () => h(Menu, {
        menus: [
          { name: 'Dashboard', path: '/dashboard' },
        ],
        onSelect,
      }),
    })

    app.mount(root)
    await nextTick()

    root.querySelector<HTMLElement>('.el-menu-item')?.click()
    await nextTick()

    expect(onSelect).toHaveBeenCalledTimes(1)
    expect(onSelect).toHaveBeenCalledWith('/dashboard', 'vertical')

    app.unmount()
    document.body.removeChild(root)
  })
})
