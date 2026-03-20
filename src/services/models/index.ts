export interface ICardItem {
  name: string;
  description: string;
  language: string;
  star: number;
  fork: number;
}

export interface IFeatureCard {
  icon: string;
  iconType: string;
  title: string;
  description: string;
}

export interface IStackItem {
  name: string;
  version: string;
  icon: string;
  iconType: string;
}

export interface IUtilityItem {
  icon: string;
  iconType: string;
  title: string;
  tag: string;
  description: string;
}
