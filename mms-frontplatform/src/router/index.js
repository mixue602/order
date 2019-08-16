import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const Liveroom = resolve => require(['components/index/liveroom/liveroom.vue'], resolve)
const GroupEdit = resolve => require(['components/user/user-testgroup/group-edit.vue'], resolve)
const GroupManage = resolve => require(['components/user/user-testgroup/group-manage.vue'], resolve)
const UserCreat = resolve => require(['components/user/user-manage/user-creat.vue'], resolve)
const UserManage = resolve => require(['components/user/user-manage/user-manage.vue'], resolve)
const UserBlack = resolve => require(['components/user/user-black/user-black.vue'], resolve)
const EffectStatis = resolve => require(['components/marketing/message-marketing/effect-statis.vue'], resolve)
const EffectStatisSingle = resolve => require(['components/marketing/message-marketing/effect-statis-single.vue'], resolve)
const MessageCreat = resolve => require(['components/marketing/message-marketing/message-creat.vue'], resolve)
const MessageManage = resolve => require(['components/marketing/message-marketing/message-manage.vue'], resolve)
const ReplyRecord = resolve => require(['components/tool/send-record/reply-record.vue'], resolve)
const SendRecord = resolve => require(['components/tool/send-record/send-record.vue'], resolve)
const MessageTemp = resolve => require(['components/tool/temp-manage/message-temp.vue'], resolve)
const ERR403 = resolve => require(['components/error/403.vue'], resolve)
const ERR404 = resolve => require(['components/error/404.vue'], resolve)
const ERR500 = resolve => require(['components/error/500.vue'], resolve)

/** CRM */
const Statistics = resolve => require(['components/crm/statistics.vue'], resolve)
const Activedeploy = resolve => require(['components/crm/active-deploy.vue'], resolve)

export default new Router({
  mode: 'history',
  fallback: false,
  routes: [
    {
      path: '/',
      name: 'liveroom',
      component: Liveroom
    },
    {
      path: '/groupedit',
      name: 'groupedit',
      component: GroupEdit
    },
    {
      path: '/groupmanage',
      name: 'groupmanage',
      component: GroupManage
    },
    {
      path: '/usercreat',
      name: 'usercreat',
      component: UserCreat
    },
    {
      path: '/usermanage',
      name: 'usermanage',
      component: UserManage
    },
    {
      path: '/userblack',
      name: 'userblack',
      component: UserBlack
    },
    {
      path: '/effectstatis',
      name: 'effectstatis',
      component: EffectStatis
    },
    {
      path: '/effectstatissingle',
      name: 'effectstatissingle',
      component: EffectStatisSingle
    },
    {
      path: '/messagecreat',
      name: 'messagecreat',
      component: MessageCreat,
      beforeRouteLeave (to, from, next) {
        if (window.groupNumTimeOut) {
          clearTimeout(window.groupNumTimeOut)
        }
        next()
      }
    },
    {
      path: '/messagemanage',
      name: 'messagemanage',
      component: MessageManage
    },
    {
      path: '/replyrecord',
      name: 'replyrecord',
      component: ReplyRecord
    },
    {
      path: '/sendrecord',
      name: 'sendrecord',
      component: SendRecord
    },
    {
      path: '/messagetemp',
      name: 'messagetemp',
      component: MessageTemp
    },
    {
      path: '/403',
      name: '403',
      component: ERR403
    },
    {
      path: '/404',
      name: '404',
      component: ERR404
    },
    {
      path: '/500',
      name: '500',
      component: ERR500
    }, {
      path: '/statistics',
      name: 'statistics',
      component: Statistics
    }, {
      path: '/activedeploy',
      name: 'activedeploy',
      component: Activedeploy
    }
  ]
})
