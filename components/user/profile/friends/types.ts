export enum EMenuOption {
  REMOVE = 'Remove Friend',
}

export type EMenuOptionObject = {
  label: string;
  value: EMenuOption;
  icon: React.ReactElement;
};
