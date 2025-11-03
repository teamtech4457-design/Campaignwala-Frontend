
import {
  DashboardPage,
  UsersPage,
  OffersPage,
  AdminSidebar,
  AdminHeader,
  StatsCard,
  ActivityFeed,
} from '../../../src/adminDashboard/index';

import DashboardPageSrc from '../../../src/adminDashboard/pages/DashboardPage';
import UsersPageSrc from '../../../src/adminDashboard/pages/UsersPage';
// Assuming OffersPage is in pages, adjust if necessary
// import OffersPageSrc from '../../../src/adminDashboard/pages/OffersPage';

import AdminSidebarSrc from '../../../src/adminDashboard/components/AdminSidebar';
import AdminHeaderSrc from '../../../src/adminDashboard/components/AdminHeader';
import StatsCardSrc from '../../../src/adminDashboard/components/StatsCard';
import ActivityFeedSrc from '../../../src/adminDashboard/components/ActivityFeed';

describe('adminDashboard index', () => {
  it('should export DashboardPage correctly', () => {
    expect(DashboardPage).toBe(DashboardPageSrc);
  });

  it('should export UsersPage correctly', () => {
    expect(UsersPage).toBe(UsersPageSrc);
  });

  // it('should export OffersPage correctly', () => {
  //   expect(OffersPage).toBe(OffersPageSrc);
  // });

  it('should export AdminSidebar correctly', () => {
    expect(AdminSidebar).toBe(AdminSidebarSrc);
  });

  it('should export AdminHeader correctly', () => {
    expect(AdminHeader).toBe(AdminHeaderSrc);
  });

  it('should export StatsCard correctly', () => {
    expect(StatsCard).toBe(StatsCardSrc);
  });

  it('should export ActivityFeed correctly', () => {
    expect(ActivityFeed).toBe(ActivityFeedSrc);
  });
});
