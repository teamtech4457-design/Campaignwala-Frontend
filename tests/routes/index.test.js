
import {
  ProtectedRoute,
  PublicRoute,
  PrivateRoute,
  RoleBasedRoute,
  AdminRouteLayout,
  UserRouteLayout,
  ModeratorRouteLayout,
  AuthenticatedRouteLayout,
  AppRouter,
} from '../../../src/routes/index';

import ProtectedRouteSrc from '../../../src/routes/ProtectedRoute';
import PublicRouteSrc from '../../../src/routes/PublicRoute';
import PrivateRouteSrc from '../../../src/routes/PrivateRoute';
import RoleBasedRouteSrc from '../../../src/routes/RoleBasedRoute';
import { AdminRouteLayout as AdminRouteLayoutSrc, UserRouteLayout as UserRouteLayoutSrc, ModeratorRouteLayout as ModeratorRouteLayoutSrc, AuthenticatedRouteLayout as AuthenticatedRouteLayoutSrc } from '../../../src/routes/RouteLayouts';
import AppRouterSrc from '../../../src/routes/AppRouter';

describe('routes index', () => {
  it('should export ProtectedRoute correctly', () => {
    expect(ProtectedRoute).toBe(ProtectedRouteSrc);
  });

  it('should export PublicRoute correctly', () => {
    expect(PublicRoute).toBe(PublicRouteSrc);
  });

  it('should export PrivateRoute correctly', () => {
    expect(PrivateRoute).toBe(PrivateRouteSrc);
  });

  it('should export RoleBasedRoute correctly', () => {
    expect(RoleBasedRoute).toBe(RoleBasedRouteSrc);
  });

  it('should export AdminRouteLayout correctly', () => {
    expect(AdminRouteLayout).toBe(AdminRouteLayoutSrc);
  });

  it('should export UserRouteLayout correctly', () => {
    expect(UserRouteLayout).toBe(UserRouteLayoutSrc);
  });

  it('should export ModeratorRouteLayout correctly', () => {
    expect(ModeratorRouteLayout).toBe(ModeratorRouteLayoutSrc);
  });

  it('should export AuthenticatedRouteLayout correctly', () => {
    expect(AuthenticatedRouteLayout).toBe(AuthenticatedRouteLayoutSrc);
  });

  it('should export AppRouter correctly', () => {
    expect(AppRouter).toBe(AppRouterSrc);
  });
});
