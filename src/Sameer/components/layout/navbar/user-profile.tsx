import { ActionIcon, Button, Switch } from "@mantine/core";
import { Menu } from "@mantine/core";
import { useCallback } from "react";
import { Link } from "react-router-dom";
import { useLogout, useUser } from "../../../lib/application/use-login";
import { RoleType } from "../../../../Suraj/pages/settings/settings-api.d";
import { useDispatch, useSelector } from "react-redux";
import { selectA11yMode } from "@/reduxStore/app/app.reducer";
import { onChangeA11yMode } from "@/reduxStore/app/app.actions";
import { UserProfileIcon } from "@/icons/UserProfile";

export const NavbarUserProfile = () => {
  const { logout } = useLogout();

  const { data: user } = useUser();

  const dispatch = useDispatch();
  const isA11yModeEnabled = useSelector(selectA11yMode);
  const toggleA11yMode = useCallback(
    () =>
      dispatch(
        onChangeA11yMode({
          isA11yModeEnabled: !isA11yModeEnabled,
        })
      ),
    [dispatch, isA11yModeEnabled]
  );

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <ActionIcon
          aria-label="User Profile"
          title="User Profile Menu"
          className="text-center"
        >
          <UserProfileIcon className="stroke-gray-800" />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        {user && user.userName && (
          <div className="mb-2 px-2">
            Logged in as <strong>{user.userName}</strong>
          </div>
        )}

        <Menu.Divider />

        <div className="px-2">
          <Switch
            aria-label="Toggle Accessible Mode"
            label="Accessible Mode"
            checked={isA11yModeEnabled}
            onChange={toggleA11yMode}
          />
        </div>

        <Menu.Divider />

        {user && user.role === RoleType.ADMIN && (
          <Menu.Item>
            <Link
              className="text-md font-display text-blue-600 hover:underline"
              to={"settings/organisation/edit/"}
            >
              Settings
            </Link>
          </Menu.Item>
        )}

        <Menu.Item>
          <Link
            className="text-md font-display text-blue-600 hover:underline"
            to={"change-password"}
          >
            Change Password
          </Link>
        </Menu.Item>

        <Menu.Item>
          <Button
            onClick={() => {
              logout();
            }}
            className="text-md font-display  hover:underline"
          >
            Logout
          </Button>
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

