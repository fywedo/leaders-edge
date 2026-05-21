import SettingsTypes "../types/settings";

module {
  public type SiteSettings = SettingsTypes.SiteSettings;

  public type SettingsState = {
    var facebookPixelId : Text;
  };

  public func get(settingsState : SettingsState) : SiteSettings {
    { facebookPixelId = settingsState.facebookPixelId };
  };

  public func update(settingsState : SettingsState, pixelId : Text) : SiteSettings {
    settingsState.facebookPixelId := pixelId;
    { facebookPixelId = settingsState.facebookPixelId };
  };
}
