
import {
  useAuth,
  useNavigation,
  usePermissions,
  useSession,
  useAuthentication,
} from '../../../src/hooks/index';

import { useAuth as useAuthSrc } from '../../../src/hooks/useAuth';
import useNavigationSrc from '../../../src/hooks/useNavigation';
import usePermissionsSrc from '../../../src/hooks/usePermissions';
import useSessionSrc from '../../../src/hooks/useSession';

describe('hooks index', () => {
  it('should export useAuth correctly', () => {
    expect(useAuth).toBe(useAuthSrc);
  });

  it('should export useNavigation correctly', () => {
    expect(useNavigation).toBe(useNavigationSrc);
  });

  it('should export usePermissions correctly', () => {
    expect(usePermissions).toBe(usePermissionsSrc);
  });

  it('should export useSession correctly', () => {
    expect(useSession).toBe(useSessionSrc);
  });

  it('should re-export useAuth as useAuthentication', () => {
    expect(useAuthentication).toBe(useAuthSrc);
  });
});
