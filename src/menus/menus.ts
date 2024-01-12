import { uid } from 'quasar'
import { MenuItem } from 'src/localstore'

const MainDrawerMenus = [
  {
    menuId: uid(),
    label: '公告与渠道',
    caption: '管理公告与通知渠道',
    icon: 'pending',
    target: '/notification',
    level: 0,
    sectionBegin: false,
    children: [
      {
        menuId: uid(),
        label: '公告',
        caption: '管理应用公告',
        icon: 'perm_identity',
        target: '/announcement',
        level: 1,
        sectionBegin: false,
        children: []
      } as MenuItem, {
        menuId: uid(),
        label: '通知',
        caption: '管理通知',
        icon: 'perm_identity',
        target: '/notif',
        level: 1,
        sectionBegin: false,
        children: []
      } as MenuItem, {
        menuId: uid(),
        label: '通知渠道',
        caption: '管理通知渠道',
        icon: 'perm_identity',
        target: '/announcement/channel',
        level: 1,
        sectionBegin: false,
        children: []
      } as MenuItem, {
        menuId: uid(),
        label: '公告用户',
        caption: '管理多播公告用户',
        icon: 'perm_identity',
        target: '/announcement/user',
        level: 1,
        sectionBegin: false,
        children: []
      } as MenuItem, {
        menuId: uid(),
        label: '通知用户',
        caption: '管理多播通知用户',
        icon: 'perm_identity',
        target: '/notif/user',
        level: 1,
        sectionBegin: false,
        children: []
      } as MenuItem
    ]
  } as MenuItem, {
    menuId: uid(),
    label: '模版',
    caption: '管理应用模版',
    icon: 'pending',
    target: '/application',
    level: 0,
    sectionBegin: false,
    children: [
      {
        menuId: uid(),
        label: '应用短信模板',
        caption: '管理应用短信模板',
        icon: 'perm_identity',
        target: '/sms/template',
        level: 1,
        sectionBegin: false,
        children: []
      } as MenuItem, {
        menuId: uid(),
        label: '应用邮件模板',
        caption: '管理应用邮件模板',
        icon: 'perm_identity',
        target: '/email/template',
        level: 1,
        sectionBegin: false,
        children: []
      } as MenuItem, {
        menuId: uid(),
        label: '应用内联系',
        caption: '管理应用内联系地址',
        icon: 'perm_identity',
        target: '/contact/template',
        level: 1,
        sectionBegin: false,
        children: []
      } as MenuItem, {
        menuId: uid(),
        label: '前端通知模版',
        caption: '管理前端通知模版',
        icon: 'perm_identity',
        target: '/notif/template',
        level: 1,
        sectionBegin: false,
        children: []
      } as MenuItem
    ]
  } as MenuItem, {
    menuId: uid(),
    label: '币种',
    caption: '管理币种',
    icon: 'format_list_numbered',
    target: '/coin',
    level: 0,
    sectionBegin: false,
    children: [{
      menuId: uid(),
      label: '币种',
      caption: '管理币种',
      icon: 'format_list_numbered',
      target: '/coin/info',
      level: 1,
      sectionBegin: false,
      children: []
    } as MenuItem, {
      menuId: uid(),
      label: '币种描述',
      caption: '管理币种描述',
      icon: 'format_list_numbered',
      target: '/coin/description',
      level: 1,
      sectionBegin: false,
      children: []
    } as MenuItem]
  } as MenuItem, {
    menuId: uid(),
    label: '国际化',
    caption: '管理应用语言包',
    icon: 'perm_identity',
    target: '/app/languages',
    level: 1,
    sectionBegin: false,
    children: [
      {
        menuId: uid(),
        label: '语言设置',
        caption: '管理应用支持语言',
        icon: 'perm_identity',
        target: '/app/languages',
        level: 1,
        sectionBegin: false,
        children: []
      } as MenuItem, {
        menuId: uid(),
        label: '语言包管理',
        caption: '管理应用文案',
        icon: 'perm_identity',
        target: '/app/messages',
        level: 1,
        sectionBegin: false,
        children: []
      } as MenuItem, {
        menuId: uid(),
        label: '国家列表',
        caption: '查看国家列表',
        icon: 'perm_identity',
        target: '/countries',
        level: 1,
        sectionBegin: false,
        children: []
      } as MenuItem
    ]
  } as MenuItem, {
    menuId: uid(),
    label: '商品',
    caption: '应用内商品定价与上下架',
    icon: 'perm_identity',
    target: '/app/goods',
    level: 1,
    sectionBegin: false,
    children: [{
      menuId: uid(),
      label: '上下架',
      caption: '价格与上下架管理',
      icon: 'perm_identity',
      target: '/app/goods',
      level: 1,
      sectionBegin: false,
      children: []
    } as MenuItem, {
      menuId: uid(),
      label: '推荐',
      caption: '添加商品推荐',
      icon: 'perm_identity',
      target: '/app/good/recommends',
      level: 1,
      sectionBegin: false,
      children: []
    } as MenuItem, {
      menuId: uid(),
      label: '促销',
      caption: '管理促销信息',
      icon: 'perm_identity',
      target: '/app/good/promotions',
      level: 1,
      sectionBegin: false,
      children: []
    } as MenuItem, {
      menuId: uid(),
      label: 'TopMost',
      caption: 'TopMost',
      icon: 'perm_identity',
      target: '/app/good/topmosts',
      level: 1,
      sectionBegin: false,
      children: []
    } as MenuItem, {
      menuId: uid(),
      label: '商品评论',
      caption: '管理商品评论',
      icon: 'perm_identity',
      target: '/app/good/comments',
      level: 1,
      sectionBegin: false,
      children: []
    } as MenuItem]
  } as MenuItem, {
    menuId: uid(),
    label: '审核',
    caption: '管理审核项目',
    icon: 'reviews',
    target: '/review',
    level: 0,
    sectionBegin: false,
    children: [
      {
        menuId: uid(),
        label: 'KYC',
        caption: '管理身份审核',
        icon: 'perm_identity',
        target: '/review/kyc',
        level: 1,
        sectionBegin: false,
        children: []
      } as MenuItem, {
        menuId: uid(),
        label: '提现地址',
        caption: '查看提现地址',
        icon: 'format_list_numbered',
        target: '/review/withdraw/address',
        level: 1,
        sectionBegin: false,
        children: []
      } as MenuItem, {
        menuId: uid(),
        label: '提现请求',
        caption: '审核提现请求',
        icon: 'format_list_numbered',
        target: '/review/withdraw',
        level: 1,
        sectionBegin: false,
        children: []
      } as MenuItem
    ]
  } as MenuItem, {
    menuId: uid(),
    label: '用户与角色',
    caption: '管理用户、角色以及资源授权',
    icon: 'reviews',
    target: '/users',
    level: 0,
    sectionBegin: false,
    children: [
      {
        menuId: uid(),
        label: '用户列表',
        caption: '查看全部用户',
        icon: 'format_list_numbered',
        target: '/users',
        level: 1,
        sectionBegin: false,
        children: []
      } as MenuItem, {
        menuId: uid(),
        label: '角色列表',
        caption: '查看全部角色',
        icon: 'format_list_numbered',
        target: '/roles',
        level: 1,
        sectionBegin: false,
        children: []
      } as MenuItem, {
        menuId: uid(),
        label: '角色用户',
        caption: '管理角色用户',
        icon: 'format_list_numbered',
        target: '/roleusers',
        level: 1,
        sectionBegin: false,
        children: []
      } as MenuItem
    ]
  } as MenuItem, {
    menuId: uid(),
    label: '激励体系',
    caption: '管理邀请码、代金券',
    icon: 'format_list_numbered',
    target: '/inspire/invitation/code',
    level: 0,
    sectionBegin: false,
    children: [{
      menuId: uid(),
      label: '邀请码 | KOL',
      caption: '邀请码 | KOL管理',
      icon: 'format_list_numbered',
      target: '/inspire/invitation/code',
      level: 1,
      sectionBegin: false,
      children: []
    } as MenuItem, {
      menuId: uid(),
      label: '佣金设置',
      caption: '佣金管理',
      icon: 'format_list_numbered',
      target: '/inspire/commission',
      level: 1,
      sectionBegin: false,
      children: []
    } as MenuItem, {
      menuId: uid(),
      label: '邀请关系',
      caption: '查看邀请关系和业绩',
      icon: 'format_list_numbered',
      target: '/inspire/invitation/relation',
      level: 1,
      sectionBegin: false,
      children: []
    } as MenuItem, {
      menuId: uid(),
      label: '事件激励',
      caption: '管理事件激励',
      icon: 'format_list_numbered',
      target: '/inspire/event',
      level: 1,
      sectionBegin: false,
      children: []
    } as MenuItem, {
      menuId: uid(),
      label: '代金券',
      caption: '管理代金券',
      icon: 'format_list_numbered',
      target: '/inspire/coupon',
      level: 1,
      sectionBegin: false,
      children: []
    } as MenuItem, {
      menuId: uid(),
      label: '空投',
      caption: '给指定用户空投代金券',
      icon: 'format_list_numbered',
      target: '/inspire/airdrop',
      level: 1,
      sectionBegin: false,
      children: []
    } as MenuItem]
  } as MenuItem, {
    menuId: uid(),
    label: '报表和账单',
    caption: '查看报表和账单',
    icon: 'format_list_numbered',
    target: '/billing',
    level: 0,
    sectionBegin: false,
    children: [{
      menuId: uid(),
      label: '订单',
      caption: '查看订单',
      icon: 'format_list_numbered',
      target: '/billing/order',
      level: 1,
      sectionBegin: false,
      children: []
    } as MenuItem, {
      menuId: uid(),
      label: '提现记录',
      caption: '查看提现记录',
      icon: 'format_list_numbered',
      target: '/billing/withdraw',
      level: 1,
      sectionBegin: false,
      children: []
    } as MenuItem]
  } as MenuItem, {
    menuId: uid(),
    label: '订单管理',
    caption: '离线订单管理',
    icon: 'format_list_numbered',
    target: '/order',
    level: 0,
    sectionBegin: false,
    children: [{
      menuId: uid(),
      label: '离线订单',
      caption: '创建离线订单',
      icon: 'format_list_numbered',
      target: '/order/offline',
      level: 1,
      sectionBegin: false,
      children: []
    } as MenuItem]
  } as MenuItem, {
    menuId: uid(),
    label: '站内转账',
    caption: '查看站内转账',
    icon: 'format_list_numbered',
    target: '/transfer',
    level: 0,
    sectionBegin: false,
    children: [{
      menuId: uid(),
      label: '白名单',
      caption: '查看白名单',
      icon: 'format_list_numbered',
      target: '/transfer/accounts',
      level: 1,
      sectionBegin: false,
      children: []
    } as MenuItem]
  } as MenuItem, {
    menuId: uid(),
    label: '操作日志',
    caption: '查看操作日志',
    icon: 'format_list_numbered',
    target: '/api',
    level: 0,
    sectionBegin: false,
    children: [{
      menuId: uid(),
      label: '操作日志',
      caption: '查看操作日志',
      icon: 'format_list_numbered',
      target: '/api/logs',
      level: 1,
      sectionBegin: false,
      children: []
    } as MenuItem]
  } as MenuItem, {
    menuId: uid(),
    label: 'CMS管理',
    caption: 'CMS管理',
    icon: 'format_list_numbered',
    target: '/cms',
    level: 0,
    sectionBegin: false,
    children: [{
      menuId: uid(),
      label: '分类管理',
      caption: '查看分类管理',
      icon: 'format_list_numbered',
      target: '/cms/category',
      level: 1,
      sectionBegin: false,
      children: []
    } as MenuItem, {
      menuId: uid(),
      label: '文章管理',
      caption: '查看文章管理',
      icon: 'format_list_numbered',
      target: '/cms/article',
      level: 1,
      sectionBegin: false,
      children: []
    } as MenuItem, {
      menuId: uid(),
      label: '媒体管理',
      caption: '查看媒体管理',
      icon: 'format_list_numbered',
      target: '/cms/media',
      level: 1,
      sectionBegin: false,
      children: []
    } as MenuItem]
  } as MenuItem
] as Array<MenuItem>

export {
  MainDrawerMenus
}
