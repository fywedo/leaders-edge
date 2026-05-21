import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import SettingsTypes "../types/settings";
import SettingsLib "../lib/settings";

mixin (
  accessControlState : AccessControl.AccessControlState,
  settingsState : SettingsLib.SettingsState,
) {
  public query func getSiteSettings() : async SettingsTypes.SiteSettings {
    SettingsLib.get(settingsState);
  };

  public shared ({ caller }) func updateSiteSettings(pixelId : Text) : async SettingsTypes.SiteSettings {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can update site settings");
    };
    SettingsLib.update(settingsState, pixelId);
  };
}
