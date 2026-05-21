<template>
  <el-scrollbar>
    <div class="not-found-page">
      <div class="not-found-page__code">
        404
      </div>
      <div class="not-found-page__title">
        页面未找到
      </div>
      <p class="not-found-page__message">
        抱歉，您访问的页面不存在
      </p>
      <router-link to="/" class="not-found-page__btn">
        返回首页
      </router-link>
    </div>
  </el-scrollbar>
</template>

<style lang="scss" scoped>
.not-found-page {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  height: 100%;
  align-items: center;
  justify-content: center;

  &__code {
    font-size: 3.75rem;
    margin-bottom: 1rem;
  }

  &__title {
    font-size: 1.25rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }

  &__message {
    color: #6b7280;
    margin-bottom: 1rem;
  }

  &__btn {
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    background-color: #3b82f6;
    transition: background-color 0.2s;
    text-decoration: none;

    &:hover {
      background-color: #2563eb;
    }
  }
}
</style>
