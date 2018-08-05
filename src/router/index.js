import Vue from 'vue';
import Router from 'vue-router';
// import Recommend from 'components/recommend/recommend';
// import Singer from 'components/singer/singer';
// import Rank from 'components/rank/rank';
// import Search from 'components/search/search';
// import SingerDetail from 'components/singer-detail/singer-detail';
// import Disc from 'components/disc/disc';
// import RankDetail from 'components/rank-detail/rank-detail';
// import UserCenter from 'components/user-center/user-center';

Vue.use(Router);
// 路由懒加载
const Recommend = (resolve) => {
  import('components/recommend/recommend').then((module) => {
    resolve(module);
  });
};

const Singer = (resolve) => {
  import('components/singer/singer').then((module) => {
    resolve(module);
  });
};

const Rank = (resolve) => {
  import('components/rank/rank').then((module) => {
    resolve(module);
  });
};

const Search = (resolve) => {
  import('components/search/search').then((module) => {
    resolve(module);
  });
};

const SingerDetail = (resolve) => {
  import('components/singer-detail/singer-detail').then((module) => {
    resolve(module);
  });
};

const Disc = (resolve) => {
  import('components/disc/disc').then((module) => {
    resolve(module);
  });
};

const RankDetail = (resolve) => {
  import('components/rank-detail/rank-detail').then((module) => {
    resolve(module);
  });
};

const UserCenter = (resolve) => {
  import('components/user-center/user-center').then((module) => {
    resolve(module);
  });
};
export default new Router({
  mode: 'history',
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
      path: '/singer',
      name: 'Singer',
      component: Singer,
      children: [
        {
          path: ':id',
          component: SingerDetail
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
          component: RankDetail
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
});
