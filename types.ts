
export enum AppState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  RESULT = 'RESULT',
}

export interface GeneratedAssets {
  images: string[];
  stlContent: string;
}
