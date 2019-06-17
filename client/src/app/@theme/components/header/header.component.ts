import {Component, Input, OnInit} from '@angular/core';

import {NbMenuItem, NbMenuService, NbSidebarService} from '@nebular/theme';
import { LocalUserService } from '../../../@core/data/local-user.service';
import { AnalyticsService } from '../../../@core/utils/analytics.service';
import { LayoutService } from '../../../@core/data/layout.service';
import {User} from '../../../@core/models/user.model';
import {NotificationsService} from '../../../@core/utils/notifications.service';
import {SiteNotification} from '../../../@core/models/notification.model';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {

  @Input() position = 'normal';
  userMenu: NbMenuItem[] = [
    {
      title: 'Profile',
      link: '/dashboard/profile',
    },
    {
      title: 'Edit Profile',
      link: '/dashboard/profile/edit',
    },
    {
      title: 'Log out',
    },
    ];

  user: User;
  notifications: SiteNotification[];
  numUnreadNotifs: number;

  constructor(private sidebarService: NbSidebarService,
              private menuService: NbMenuService,
              private userService: LocalUserService,
              private analyticsService: AnalyticsService,
              private layoutService: LayoutService,
              private notificationService: NotificationsService) {
    this.notifications = [];
    this.numUnreadNotifs = 0;
    this.menuService.onItemClick().subscribe((event) => {
      this.onContextItemSelection(event.item.title);
    });
  }

  ngOnInit() {
    this.userService.getLocal().subscribe(usr => {
      this.user = usr;
    });
    this.notificationService.notifications.subscribe(notifs => {
      this.notifications = notifs;
      this.numUnreadNotifs = this.notifications.filter(notif => notif.read === false).length;
    });
  }

  onContextItemSelection(title) {
    if (title === 'Log out') {
      this.userService.logout();
    }
  }
  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();

    return false;
  }

  goToHome() {
    this.menuService.navigateHome();
  }

  startSearch() {
    this.analyticsService.trackEvent('startSearch');
  }

  getNotificationIconClass() {
    if (this.notifications.length === 0)
      return 'bell-outline';
    else {
      return 'bell';
    }
  }
}
