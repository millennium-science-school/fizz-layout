import { useRouter } from 'vue-router'
import { useTabsStore } from '../store/useTabsStore'

function useRefresh() {
  const router = useRouter()
  const tabsStore = useTabsStore()

  async function refresh() {
    await tabsStore.refresh(router)
  }

  return { refresh }
}

export { useRefresh }
