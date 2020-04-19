export interface ZendModeState {
  userId: string | null;
  enterZenMode: (userId: string) => void;
  exitZenMode: () => void;
}
