import Fact from '@atlassian/bitkit-analytics';

type FlagProps = {
  flag_id: string;
};

type FlagActionClickedProps = FlagProps & {
  action_id: string;
};

export class FlagActionClicked extends Fact<FlagActionClickedProps> {
  name = 'bitbucket.flags.action_clicked';
}

export class FlagDismissed extends Fact<FlagProps> {
  name = 'bitbucket.flags.dismissed';
}

export class FlagViewed extends Fact<FlagProps> {
  name = 'bitbucket.flags.viewed';
}

type FocusedTaskPageBackButtonClickedFactProps = {
  page_name: string;
};

export class FocusedTaskPageBackButtonClickedFact extends Fact<
  FocusedTaskPageBackButtonClickedFactProps
> {
  name = 'bitbucket.navigation.focused-task.back-button.clicked';
}

type ToggleSearchDrawerFactProps = {
  action: 'opened' | 'closed';
};

export class ToggleSearchDrawerFact extends Fact<ToggleSearchDrawerFactProps> {
  name = 'bitbucket.search_drawer.toggled';
}
