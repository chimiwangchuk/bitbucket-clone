import Fact from '@atlassian/bitkit-analytics';

type KeyboardShortcutFiredProps = {
  shortcut_id: string;
  trigger_keys: string;
};

export class KeyboardShortcutFired extends Fact<KeyboardShortcutFiredProps> {
  name = 'bitbucket.keyboard_shortcuts.fired';
}
