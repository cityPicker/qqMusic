import Vue from 'vue'
import Router from 'vue-router'

const Recommend = resolve => {
  import('@/components/Recommend/Recommend').then((module) => {
    resolve(module)
  })
}

const Rank = resolve => {
  import('@/components/Rank/rank').then((module) => {
    resolve(module)
  })
}

const Singer = resolve => {
  import('@/components/Singer/singer').then((module) => {
    resolve(module)
  })
}

const Search = resolve => {
  import('@/components/Search/search').then((module) => {
    resolve(module)
  })
}

const SingerDetail = resolve => {
  import('@/components/singer-detail/singer-detail').then((module) => {
    resolve(module)
  })
}

const Disc = resolve => {
  import('@/components/disc/disc').then((module) => {
    resolve(module)
  })
}

const TopList = resolve => {
  import('@/components/top-list/top-list').then((module) => {
    resolve(module)
  })
}

const UserCenter = resolve => {
  import('@/components/user-center/user-center').then((module) => {
    resolve(module)
  })
}

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      name: 'Recommend',
      component: Recommend,
      children: [
        {
          path: ':id',
          component: Disc
        }
      ]
    },
    {
      path: '/rank',
      name: 'Rank',
      component: Rank,
      children: [
        {
          path: ':id',
          component: TopList
        }
      ]
    },
    {
      path: '/singer',
      component: Singer,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/search',
      name: 'Search',
      component: Search,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/user',
      name: 'UserCenter',
      component: UserCenter
    }
  ]
})
